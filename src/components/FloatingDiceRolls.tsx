"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dice6,
  Dice1,
  ChevronUp,
  ChevronDown,
  Zap,
  Sword,
  Trash2,
  Bell,
  BellOff,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import RollOutcomeBadge from "@/components/RollOutcomeBadge";
import { getDiceRollOutcome } from "@/utils/dice";

interface FloatingDiceRollsProps {
  gameId?: string;
  onFearRoll?: () => void;
}

interface DiceRoll {
  id: string;
  name: string;
  rollType: string;
  total: number;
  modifier?: number | null;
  finalTotal?: number | null;
  hopeResult?: number | null;
  fearResult?: number | null;
  individualResults: unknown;
  user: { name: string | null; image: string | null };
  character?: { name: string } | null;
  createdAt: Date;
}

interface NewRollNotification {
  id: string;
  roll: DiceRoll;
  timestamp: number;
  isRemoving?: boolean;
}

const FloatingDiceRolls = ({ gameId, onFearRoll }: FloatingDiceRollsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newRollNotifications, setNewRollNotifications] = useState<
    NewRollNotification[]
  >([]);
  const [diceExpression, setDiceExpression] = useState("");
  const { data: session } = useSession();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prevRollsRef = useRef<DiceRoll[]>([]);
  const hasInitializedRef = useRef(false);

  const {
    data: rolls,
    isLoading,
    refetch,
  } = api.game.getRecentRolls.useQuery(
    { gameId: gameId!, limit: 10 },
    { enabled: !!gameId && !!session },
  );

  // Subscribe to real-time dice roll updates
  api.game.onDiceRoll.useSubscription(
    { gameId: gameId! },
    {
      enabled: !!gameId && !!session,
      onData: (_newRoll) => {
        // Trigger a refetch to get updated data including the new roll
        void refetch();
      },
    },
  );

  const clearRolls = api.game.clearRolls.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  // Dice roll mutations
  const rollActionDice = api.game.rollActionDice.useMutation();
  const rollCustomDice = api.game.rollCustomDice.useMutation({
    onSuccess: () => {
      setDiceExpression("");
    },
  });

  // Check if user is game master for this game
  const { data: game } = api.game.getById.useQuery(
    { id: gameId! },
    { enabled: !!gameId },
  );
  const isGameMaster = game?.gameMaster.id === session?.user.id;

  const handleClearRolls = () => {
    clearRolls.mutate({ gameId: gameId! });
  };

  // Dice roll handlers
  const handleCustomRoll = () => {
    if (!diceExpression.trim()) return;

    rollCustomDice.mutate({
      gameId: gameId!,
      name: diceExpression.trim(),
      diceExpression: diceExpression.trim(),
    });
  };

  const handleQuickD20 = () => {
    rollCustomDice.mutate({
      gameId: gameId!,
      name: "1d20",
      diceExpression: "1d20",
    });
  };

  const handleQuickAction = () => {
    rollActionDice.mutate({
      gameId: gameId!,
      name: "Action",
    });
  };

  const rollCount = rolls?.length ?? 0;

  // Function to handle smooth removal of notifications
  const removeNotification = (notificationId: string) => {
    // First, mark the notification as removing to trigger fade-out
    setNewRollNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, isRemoving: true } : n,
      ),
    );

    // After fade-out animation completes, actually remove it
    setTimeout(() => {
      setNewRollNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId),
      );
    }, 500); // Match the CSS transition duration
  };

  // Auto-scroll to bottom when new rolls are added
  useEffect(() => {
    if (isExpanded && scrollContainerRef.current && rolls && rolls.length > 0) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [rolls, isExpanded]);

  // Detect new rolls and create notifications
  useEffect(() => {
    if (!rolls) return;

    const prevRollIds = new Set(prevRollsRef.current.map((roll) => roll.id));

    // Find new rolls (in current but not in previous)
    const newRolls = rolls.filter((roll) => !prevRollIds.has(roll.id));

    // Show notifications for new rolls, but only after the component has been initialized
    // This prevents notifications from showing for existing rolls on initial load
    if (newRolls.length > 0 && hasInitializedRef.current) {
      newRolls.forEach((roll) => {
        // Only show notifications if enabled AND panel is not expanded
        if (notificationsEnabled && !isExpanded) {
          const notification: NewRollNotification = {
            id: `notification-${roll.id}`,
            roll: roll as DiceRoll,
            timestamp: Date.now(),
          };

          setNewRollNotifications((prev) => [...prev, notification]);

          // Auto-remove after 10 seconds
          setTimeout(() => {
            removeNotification(notification.id);
          }, 10000);
        }

        // Check if this is a "With Fear" roll and trigger callback (always check, regardless of notifications)
        if (
          roll.rollType === "Action" &&
          roll.hopeResult &&
          roll.fearResult &&
          onFearRoll
        ) {
          const outcome = getDiceRollOutcome(roll.hopeResult, roll.fearResult);
          if (outcome === "with Fear") {
            onFearRoll();
          }
        }
      });
    }

    // Mark as initialized after the first load
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
    }

    // Update previous rolls reference
    prevRollsRef.current = rolls as DiceRoll[];
  }, [rolls, isExpanded, notificationsEnabled, onFearRoll]);

  // Only show if we have a gameId and session
  if (!gameId || !session) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start">
      {/* New Roll Notifications */}
      {newRollNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`mb-2 transition-opacity duration-500 ${
            notification.isRemoving
              ? "opacity-0"
              : "animate-in slide-in-from-left-5 fade-in opacity-100"
          }`}
          style={{
            marginBottom: `${(newRollNotifications.length - index - 1) * 8 + 8}px`,
          }}
        >
          <div className="rounded-lg border border-sky-500 bg-slate-800/95 p-3 shadow-xl backdrop-blur-sm">
            {/* Header */}
            <div className="mb-2 flex items-center gap-2">
              {notification.roll.user.image && (
                <Image
                  src={notification.roll.user.image}
                  alt={notification.roll.user.name ?? ""}
                  width={20}
                  height={20}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="text-sm font-medium text-white">
                {notification.roll.user.name}
              </span>
              {notification.roll.character && (
                <>
                  <span className="text-xs text-slate-400">as</span>
                  <span className="text-sm font-medium text-sky-400">
                    {notification.roll.character.name}
                  </span>
                </>
              )}
              <div className="ml-auto flex items-center gap-1">
                {notification.roll.rollType === "Action" ? (
                  <Zap className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Sword className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            {/* Roll name */}
            <div className="mb-2">
              <span className="text-sm font-semibold text-white">
                {notification.roll.name}
              </span>
            </div>

            {/* Results */}
            {notification.roll.rollType === "Action" ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Hope:</span>
                    <span className="font-bold text-yellow-400">
                      {notification.roll.hopeResult}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Fear:</span>
                    <span className="font-bold text-red-400">
                      {notification.roll.fearResult}
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-slate-400">Total:</span>
                    <span className="font-bold text-white">
                      {notification.roll.total}
                    </span>
                    {notification.roll.modifier !== null &&
                      notification.roll.modifier !== undefined &&
                      notification.roll.modifier !== 0 && (
                        <>
                          <span className="text-xs text-slate-400">
                            {notification.roll.modifier > 0 ? "+" : ""}
                            {notification.roll.modifier}
                          </span>
                          <span className="text-xs text-slate-400">=</span>
                          <span className="font-bold text-sky-400">
                            {notification.roll.finalTotal}
                          </span>
                        </>
                      )}
                    {/* Always display the RollOutcomeBadge for Action rolls */}
                    <RollOutcomeBadge
                      hopeResult={notification.roll.hopeResult!}
                      fearResult={notification.roll.fearResult!}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">Total:</span>
                  <span className="font-bold text-red-400">
                    {notification.roll.total}
                  </span>
                </div>
                <div className="ml-auto text-xs text-slate-400">
                  [
                  {(notification.roll.individualResults as number[]).join(", ")}
                  ]
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Floating Panel */}
      {isExpanded && (
        <div className="mb-2 rounded-lg border border-slate-700 bg-slate-800/95 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 p-3">
            <div className="flex items-center gap-2">
              <Dice6 className="h-4 w-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Recent Rolls</h3>
              {rollCount > 0 && (
                <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs text-white">
                  {rollCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`text-xs ${
                  notificationsEnabled
                    ? "text-sky-400 hover:bg-sky-950 hover:text-sky-300"
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
                }`}
                title={
                  notificationsEnabled
                    ? "Disable notifications"
                    : "Enable notifications"
                }
              >
                {notificationsEnabled ? (
                  <Bell className="h-3 w-3" />
                ) : (
                  <BellOff className="h-3 w-3" />
                )}
              </Button>
              {isGameMaster && rolls && rolls.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:bg-red-950 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-slate-700 bg-slate-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Clear Dice Roll History
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Are you sure you want to permanently delete all dice
                        roll history for this game? This action cannot be undone
                        and will remove all {rolls.length} roll
                        {rolls.length !== 1 ? "s" : ""} from the record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearRolls}
                        disabled={clearRolls.isPending}
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        {clearRolls.isPending ? "Clearing..." : "Clear History"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          {/* Dice Roller Section */}
          <div className="border-b border-slate-700 p-3">
            <div className="space-y-3">
              {/* Custom dice input */}
              <div className="flex gap-2">
                <Input
                  value={diceExpression}
                  onChange={(e) => setDiceExpression(e.target.value)}
                  placeholder="e.g., 3d6+2, 1d20, 2d10+1d4"
                  className="flex-1 border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomRoll();
                    }
                  }}
                />
                <Button
                  onClick={handleCustomRoll}
                  disabled={!diceExpression.trim() || rollCustomDice.isPending}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                  size="sm"
                >
                  Roll
                </Button>
              </div>

              {/* Quick roll buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleQuickD20}
                  disabled={rollCustomDice.isPending}
                  className="flex items-center gap-1 bg-sky-600 text-white hover:bg-sky-700"
                  size="sm"
                >
                  <Dice1 className="h-3 w-3" />
                  1d20
                </Button>
                <Button
                  onClick={handleQuickAction}
                  disabled={rollActionDice.isPending}
                  className="flex items-center gap-1 bg-yellow-600 text-white hover:bg-yellow-700"
                  size="sm"
                >
                  <Zap className="h-3 w-3" />
                  Action
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative">
            {/* Gradient overlay at top */}
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-4 bg-gradient-to-b from-slate-800/95 to-transparent" />

            <div
              ref={scrollContainerRef}
              className="max-h-64 overflow-y-auto p-3"
            >
              {isLoading ? (
                <div className="py-4 text-center text-slate-400">
                  Loading rolls...
                </div>
              ) : !rolls || rolls.length === 0 ? (
                <div className="py-4 text-center text-slate-400">
                  No dice rolls yet. Be the first to roll!
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Reverse the array to show newest at bottom */}
                  {[...rolls].reverse().map((roll) => (
                    <div
                      key={roll.id}
                      className="rounded border border-slate-600 bg-slate-700/80 p-2 text-xs"
                    >
                      {/* Header */}
                      <div className="mb-1 flex items-center gap-1">
                        {roll.user.image && (
                          <Image
                            src={roll.user.image}
                            alt={roll.user.name ?? ""}
                            width={16}
                            height={16}
                            className="h-4 w-4 rounded-full"
                          />
                        )}
                        <span className="truncate font-medium text-white">
                          {roll.user.name}
                        </span>
                        {roll.character && (
                          <>
                            <span className="text-slate-500">as</span>
                            <span className="truncate font-medium text-sky-400">
                              {roll.character.name}
                            </span>
                          </>
                        )}
                        <div className="ml-auto flex items-center gap-1">
                          {roll.rollType === "Action" ? (
                            <Zap className="h-3 w-3 text-yellow-500" />
                          ) : (
                            <Sword className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Roll name */}
                      <div className="mb-1">
                        <span className="font-semibold text-white">
                          {roll.name}
                        </span>
                      </div>

                      {/* Results */}
                      {roll.rollType === "Action" ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">H:</span>
                            <span className="font-bold text-yellow-400">
                              {roll.hopeResult}
                            </span>
                            <span className="text-slate-400">F:</span>
                            <span className="font-bold text-red-400">
                              {roll.fearResult}
                            </span>
                            <span className="ml-auto text-slate-400">
                              Total:
                            </span>
                            <span className="font-bold text-white">
                              {roll.total}
                            </span>
                            {roll.modifier !== null && roll.modifier !== 0 && (
                              <>
                                <span className="text-slate-400">
                                  {roll.modifier > 0 ? "+" : ""}
                                  {roll.modifier}
                                </span>
                                <span className="text-slate-400">=</span>
                                <span className="font-bold text-sky-400">
                                  {roll.finalTotal}
                                </span>
                              </>
                            )}
                            {/* Always display the RollOutcomeBadge for Action rolls */}
                            <RollOutcomeBadge
                              hopeResult={roll.hopeResult!}
                              fearResult={roll.fearResult!}
                              size="sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-400">Total:</span>
                          <span className="font-bold text-red-400">
                            {roll.total}
                          </span>
                          <span className="ml-auto text-slate-400">
                            [{(roll.individualResults as number[]).join(", ")}]
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-12 w-12 rounded-full border border-slate-600 bg-slate-800 text-white shadow-lg hover:bg-slate-700"
        size="sm"
      >
        <div className="flex flex-col items-center">
          <Dice6 className="h-4 w-4" />
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronUp className="h-3 w-3" />
          )}
        </div>
      </Button>
    </div>
  );
};

export default FloatingDiceRolls;
