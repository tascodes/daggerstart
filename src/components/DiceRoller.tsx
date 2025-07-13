"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Dice1, Dice6, Zap } from "lucide-react";

interface DiceRollerProps {
  gameId: string;
  characterId?: string;
  characterName?: string;
}

export default function DiceRoller({
  gameId,
  characterId,
  characterName,
}: DiceRollerProps) {
  const [diceExpression, setDiceExpression] = useState("");

  const rollActionDice = api.game.rollActionDice.useMutation();
  const rollCustomDice = api.game.rollCustomDice.useMutation({
    onSuccess: () => {
      setDiceExpression("");
    },
  });

  const handleCustomRoll = () => {
    if (!diceExpression.trim()) return;

    rollCustomDice.mutate({
      gameId,
      name: diceExpression.trim(),
      diceExpression: diceExpression.trim(),
      characterId,
    });
  };

  const handleQuickD20 = () => {
    rollCustomDice.mutate({
      gameId,
      name: "1d20",
      diceExpression: "1d20",
      characterId,
    });
  };

  const handleQuickAction = () => {
    rollActionDice.mutate({
      gameId,
      name: "Action",
      characterId,
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Dice6 className="h-5 w-5 text-sky-400" />
        <h3 className="text-lg font-bold text-white">
          Dice Roller {characterName && `- ${characterName}`}
        </h3>
      </div>

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
        >
          {rollCustomDice.isPending ? "Rolling..." : "Roll"}
        </Button>
      </div>

      {/* Quick roll buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleQuickD20}
          disabled={rollCustomDice.isPending}
          className="flex items-center gap-2 bg-sky-600 text-white hover:bg-sky-700"
        >
          <Dice1 className="h-4 w-4" />
          1d20
        </Button>
        <Button
          onClick={handleQuickAction}
          disabled={rollActionDice.isPending}
          className="flex items-center gap-2 bg-yellow-600 text-white hover:bg-yellow-700"
        >
          <Zap className="h-4 w-4" />
          Action
        </Button>
      </div>
    </div>
  );
}
