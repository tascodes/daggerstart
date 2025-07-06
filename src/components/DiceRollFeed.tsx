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

interface DiceRollFeedProps {
  gameId: string;
  isGameMaster?: boolean;
  limit?: number;
}

export default function DiceRollFeed({ gameId, isGameMaster = false, limit = 10 }: DiceRollFeedProps) {
  const { data: rolls, isLoading, refetch } = api.game.getRecentRolls.useQuery(
    { gameId, limit },
    { refetchInterval: 3000 } // Refresh every 3 seconds for now
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
      <div className="p-4 rounded-lg border border-slate-700 bg-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Recent Rolls</h3>
        <div className="text-slate-400">Loading rolls...</div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Recent Rolls</h3>
        {isGameMaster && rolls && rolls.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-800 border-slate-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Clear Dice Roll History
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Are you sure you want to permanently delete all dice roll history for this game? 
                  This action cannot be undone and will remove all {rolls.length} roll{rolls.length !== 1 ? 's' : ''} from the record.
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
        <div className="text-slate-400 text-center py-8">
          No dice rolls yet. Be the first to roll!
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {rolls.map((roll) => (
            <div key={roll.id} className="bg-slate-700 rounded-lg p-3 border border-slate-600">
              {/* Header with user info */}
              <div className="flex items-center gap-2 mb-2">
                {roll.user.image && (
                  <Image
                    src={roll.user.image}
                    alt={roll.user.name ?? ""}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-white font-medium">{roll.user.name}</span>
                {roll.character && (
                  <>
                    <span className="text-slate-400">as</span>
                    <span className="text-sky-400 font-medium">{roll.character.name}</span>
                  </>
                )}
                <div className="flex items-center gap-1 ml-auto">
                  {roll.rollType === "Action" ? (
                    <Zap className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <Sword className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-xs text-slate-400">
                    {new Date(roll.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Roll name and type */}
              <div className="mb-2">
                <span className="text-white font-semibold">{roll.name}</span>
                <span className="text-slate-400 text-sm ml-2">({roll.diceExpression})</span>
              </div>

              {/* Results */}
              {roll.rollType === "Action" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Hope:</span>
                      <span className="text-lg font-bold text-yellow-400">{roll.hopeResult}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">Fear:</span>
                      <span className="text-lg font-bold text-red-400">{roll.fearResult}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-sm text-slate-400">Total:</span>
                      <span className="text-xl font-bold text-white">{roll.total}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Outcome:</span>
                    <span 
                      className={`font-bold text-sm px-2 py-1 rounded ${
                        roll.rollOutcome === "Critical Success" 
                          ? "bg-purple-600 text-white"
                          : roll.rollOutcome === "with Hope"
                          ? "bg-yellow-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {roll.rollOutcome}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Individual:</span>
                    <span className="text-white font-mono">
                      [{(roll.individualResults as number[]).join(", ")}]
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-slate-400">Total:</span>
                    <span className="text-xl font-bold text-red-400">{roll.total}</span>
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