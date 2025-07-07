"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
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
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [damageDialogOpen, setDamageDialogOpen] = useState(false);
  const [actionRollName, setActionRollName] = useState("");
  const [damageRollName, setDamageRollName] = useState("");
  const [diceType, setDiceType] = useState<
    "d4" | "d6" | "d8" | "d10" | "d12" | "d20"
  >("d6");
  const [quantity, setQuantity] = useState(1);

  const rollActionDice = api.game.rollActionDice.useMutation({
    onSuccess: () => {
      setActionDialogOpen(false);
      setActionRollName("");
    },
  });

  const rollDamage = api.game.rollDamage.useMutation({
    onSuccess: () => {
      setDamageDialogOpen(false);
      setDamageRollName("");
    },
  });

  const handleActionRoll = () => {
    if (!actionRollName.trim()) return;

    rollActionDice.mutate({
      gameId,
      name: actionRollName.trim(),
      characterId,
    });
  };

  const handleDamageRoll = () => {
    if (!damageRollName.trim()) return;

    rollDamage.mutate({
      gameId,
      name: damageRollName.trim(),
      diceType,
      quantity,
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

      <div className="flex gap-2">
        {/* Action Roll Button */}
        <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-yellow-600 text-white hover:bg-yellow-700">
              <Zap className="h-4 w-4" />
              Action Roll
            </Button>
          </DialogTrigger>
          <DialogContent className="border-slate-700 bg-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">
                Action Roll (2d12)
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Roll Hope and Fear dice to determine your action&apos;s outcome.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="actionName" className="text-white">
                  What are you doing?
                </Label>
                <Input
                  id="actionName"
                  value={actionRollName}
                  onChange={(e) => setActionRollName(e.target.value)}
                  placeholder="e.g., Attack, Stealth, Persuasion"
                  className="border-slate-600 bg-slate-700 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
                className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleActionRoll}
                disabled={!actionRollName.trim() || rollActionDice.isPending}
                className="bg-yellow-600 text-white hover:bg-yellow-700"
              >
                {rollActionDice.isPending ? "Rolling..." : "Roll Action"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Damage Roll Button */}
        <Dialog open={damageDialogOpen} onOpenChange={setDamageDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700">
              <Dice1 className="h-4 w-4" />
              Damage Roll
            </Button>
          </DialogTrigger>
          <DialogContent className="border-slate-700 bg-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Damage Roll</DialogTitle>
              <DialogDescription className="text-slate-400">
                Roll damage dice for your attack or spell.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="damageName" className="text-white">
                  Damage source
                </Label>
                <Input
                  id="damageName"
                  value={damageRollName}
                  onChange={(e) => setDamageRollName(e.target.value)}
                  placeholder="e.g., Sword Attack, Fireball"
                  className="border-slate-600 bg-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diceType" className="text-white">
                    Dice Type
                  </Label>
                  <Select
                    value={diceType}
                    onValueChange={(
                      value: "d4" | "d6" | "d8" | "d10" | "d12" | "d20",
                    ) => setDiceType(value)}
                  >
                    <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-700">
                      <SelectItem
                        value="d4"
                        className="text-white focus:bg-slate-600"
                      >
                        d4
                      </SelectItem>
                      <SelectItem
                        value="d6"
                        className="text-white focus:bg-slate-600"
                      >
                        d6
                      </SelectItem>
                      <SelectItem
                        value="d8"
                        className="text-white focus:bg-slate-600"
                      >
                        d8
                      </SelectItem>
                      <SelectItem
                        value="d10"
                        className="text-white focus:bg-slate-600"
                      >
                        d10
                      </SelectItem>
                      <SelectItem
                        value="d12"
                        className="text-white focus:bg-slate-600"
                      >
                        d12
                      </SelectItem>
                      <SelectItem
                        value="d20"
                        className="text-white focus:bg-slate-600"
                      >
                        d20
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-white">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="20"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="border-slate-600 bg-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDamageDialogOpen(false)}
                className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDamageRoll}
                disabled={!damageRollName.trim() || rollDamage.isPending}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {rollDamage.isPending
                  ? "Rolling..."
                  : `Roll ${quantity}${diceType}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
