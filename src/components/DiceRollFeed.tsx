"use client";

import { api } from "~/trpc/react";
import { Zap, Sword, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
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
} from "~/components/ui/alert-dialog";
import Image from "next/image";
import RollOutcomeBadge from "~/components/RollOutcomeBadge";

interface DiceRollFeedProps {
  gameId: string;
  isGameMaster?: boolean;
  limit?: number;
}

export default function DiceRollFeed({
  gameId,
  isGameMaster = false,
  limit = 10,
}: DiceRollFeedProps) {
  const {
    data: rolls,
    isLoading,
    refetch,
  } = api.game.getRecentRolls.useQuery({ gameId, limit });

  // Subscribe to real-time dice roll updates
  api.game.onDiceRoll.useSubscription(
    { gameId },
    {
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

  const handleClearRolls = () => {
    clearRolls.mutate({ gameId });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-4 text-lg font-bold text-white">Recent Rolls</h3>
        <div className="text-slate-400">Loading rolls...</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Recent Rolls</h3>
        {isGameMaster && rolls && rolls.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:bg-red-950 hover:text-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-slate-700 bg-slate-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Clear Dice Roll History
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Are you sure you want to permanently delete all dice roll
                  history for this game? This action cannot be undone and will
                  remove all {rolls.length} roll{rolls.length !== 1 ? "s" : ""}{" "}
                  from the record.
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

      {!rolls || rolls.length === 0 ? (
        <div className="py-8 text-center text-slate-400">
          No dice rolls yet. Be the first to roll!
        </div>
      ) : (
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {rolls.map((roll) => (
            <div
              key={roll.id}
              className="rounded-lg border border-slate-600 bg-slate-700 p-3"
            >
              {/* Header with user info */}
              <div className="mb-2 flex items-center gap-2">
                {roll.user.image && (
                  <Image
                    src={roll.user.image}
                    alt={roll.user.name ?? ""}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="font-medium text-white">{roll.user.name}</span>
                {roll.character && (
                  <>
                    <span className="text-slate-400">as</span>
                    <span className="font-medium text-sky-400">
                      {roll.character.name}
                    </span>
                  </>
                )}
                <div className="ml-auto flex items-center gap-1">
                  {roll.rollType === "Action" ? (
                    <Zap className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Sword className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(roll.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Roll name and type */}
              <div className="mb-2">
                <span className="font-semibold text-white">{roll.name}</span>
                <span className="ml-2 text-sm text-slate-400">
                  ({roll.diceExpression})
                </span>
              </div>

              {/* Results */}
              {roll.rollType === "Action" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Hope:</span>
                      <span className="text-lg font-bold text-yellow-400">
                        {roll.hopeResult}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Fear:</span>
                      <span className="text-lg font-bold text-red-400">
                        {roll.fearResult}
                      </span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-sm text-slate-400">Total:</span>
                      <span className="text-xl font-bold text-white">
                        {roll.total}
                      </span>
                      {roll.modifier !== null && roll.modifier !== 0 && (
                        <>
                          <span className="text-sm text-slate-400">
                            {roll.modifier > 0 ? "+" : ""}
                            {roll.modifier}
                          </span>
                          <span className="text-sm text-slate-400">=</span>
                          <span className="text-xl font-bold text-sky-400">
                            {roll.finalTotal}
                          </span>
                          <RollOutcomeBadge
                            hopeResult={roll.hopeResult!}
                            fearResult={roll.fearResult!}
                            size="md"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Individual:</span>
                    <span className="font-mono text-white">
                      [{(roll.individualResults as number[]).join(", ")}]
                    </span>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-slate-400">Total:</span>
                    <span className="text-xl font-bold text-red-400">
                      {roll.total}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
