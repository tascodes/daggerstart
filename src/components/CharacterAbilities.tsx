"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Swords, Edit3, Check, X } from "lucide-react";
import { api } from "~/trpc/react";

interface CharacterAbilitiesProps {
  character: {
    id: string;
    agilityModifier: number;
    strengthModifier: number;
    finesseModifier: number;
    instinctModifier: number;
    presenceModifier: number;
    knowledgeModifier: number;
  };
  isOwner: boolean;
  game?: {
    id: string;
    name: string;
  } | null;
  onUpdate?: () => void;
}

interface Ability {
  name: string;
  key: keyof Omit<CharacterAbilitiesProps["character"], "id">;
  examples: string[];
}

const abilities: Ability[] = [
  {
    name: "AGILITY",
    key: "agilityModifier",
    examples: ["Sprint", "Leap", "Maneuver"],
  },
  {
    name: "STRENGTH",
    key: "strengthModifier",
    examples: ["Lift", "Smash", "Grapple"],
  },
  {
    name: "FINESSE",
    key: "finesseModifier",
    examples: ["Control", "Hide", "Tinker"],
  },
  {
    name: "INSTINCT",
    key: "instinctModifier",
    examples: ["Perceive", "Sense", "Navigate"],
  },
  {
    name: "PRESENCE",
    key: "presenceModifier",
    examples: ["Charm", "Perform", "Deceive"],
  },
  {
    name: "KNOWLEDGE",
    key: "knowledgeModifier",
    examples: ["Recall", "Analyze", "Comprehend"],
  },
];

export default function CharacterAbilities({
  character,
  isOwner,
  game,
  onUpdate,
}: CharacterAbilitiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    agilityModifier: character.agilityModifier.toString(),
    strengthModifier: character.strengthModifier.toString(),
    finesseModifier: character.finesseModifier.toString(),
    instinctModifier: character.instinctModifier.toString(),
    presenceModifier: character.presenceModifier.toString(),
    knowledgeModifier: character.knowledgeModifier.toString(),
  });

  const updateAbilities = api.character.updateAbilities.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      onUpdate?.();
    },
  });

  const rollActionDice = api.game.rollActionDice.useMutation();

  const handleAbilityClick = (
    abilityName: string,
    abilityKey: keyof Omit<CharacterAbilitiesProps["character"], "id">,
  ) => {
    if (!game || isEditing) return;

    const modifier = character[abilityKey];

    rollActionDice.mutate({
      gameId: game.id,
      name: abilityName,
      characterId: character.id,
      modifier: modifier,
    });
  };

  const formatModifier = (value: number): string => {
    if (value > 0) return `+${value}`;
    if (value < 0) return `${value}`;
    return "+0";
  };

  const handleSave = () => {
    // Validate all values before saving
    const numericValues: Record<string, number> = {};
    const errors: string[] = [];

    Object.entries(editValues).forEach(([key, value]) => {
      const numValue = parseInt(value);
      if (isNaN(numValue)) {
        errors.push(`${key.replace("Modifier", "")} must be a valid number`);
      } else if (numValue < -10 || numValue > 10) {
        errors.push(
          `${key.replace("Modifier", "")} must be between -10 and 10`,
        );
      } else {
        numericValues[key] = numValue;
      }
    });

    if (errors.length > 0) {
      alert(`Please fix the following errors:\n${errors.join("\n")}`);
      return;
    }

    updateAbilities.mutate({
      id: character.id,
      agilityModifier: numericValues.agilityModifier!,
      strengthModifier: numericValues.strengthModifier!,
      finesseModifier: numericValues.finesseModifier!,
      instinctModifier: numericValues.instinctModifier!,
      presenceModifier: numericValues.presenceModifier!,
      knowledgeModifier: numericValues.knowledgeModifier!,
    });
  };

  const handleCancel = () => {
    setEditValues({
      agilityModifier: character.agilityModifier.toString(),
      strengthModifier: character.strengthModifier.toString(),
      finesseModifier: character.finesseModifier.toString(),
      instinctModifier: character.instinctModifier.toString(),
      presenceModifier: character.presenceModifier.toString(),
      knowledgeModifier: character.knowledgeModifier.toString(),
    });
    setIsEditing(false);
  };

  const handleInputChange = (key: keyof typeof editValues, value: string) => {
    // Allow any string input during editing - validation happens on save
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="border-slate-700 bg-slate-800 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Swords className="h-5 w-5 text-sky-400" />
            Abilities
          </CardTitle>
          {isOwner && (
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateAbilities.isPending}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={updateAbilities.isPending}
                    className="text-slate-400 hover:bg-slate-700 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="text-slate-400 hover:bg-slate-700 hover:text-white"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {abilities.map((ability) => {
            const currentValue = character[ability.key];
            const editValue = editValues[ability.key];

            const canRoll = game && !isEditing;

            return (
              <div key={ability.name} className="flex flex-col items-center">
                {/* Ability Header */}
                <div
                  className={`mb-2 w-full rounded-t-lg bg-slate-700 px-3 py-2 text-center ${
                    canRoll
                      ? "cursor-pointer transition-colors hover:bg-slate-600"
                      : ""
                  }`}
                  onClick={() => handleAbilityClick(ability.name, ability.key)}
                  title={canRoll ? `Roll ${ability.name}` : undefined}
                >
                  <h3 className="text-xs font-bold tracking-wide text-white uppercase">
                    {ability.name}
                  </h3>
                </div>

                {/* Shield-like container for modifier */}
                <div className="relative mb-3 flex h-20 w-16 items-center justify-center">
                  {/* Shield background */}
                  <div
                    className="absolute inset-0 rounded-lg border-2 border-slate-600 bg-slate-700"
                    style={{
                      clipPath:
                        "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
                    }}
                  ></div>

                  {/* Modifier value */}
                  <div className="relative z-10 flex items-center justify-center">
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editValue}
                        onChange={(e) =>
                          handleInputChange(ability.key, e.target.value)
                        }
                        className="h-8 w-12 border-slate-500 bg-slate-600 text-center text-sm font-bold text-white"
                      />
                    ) : (
                      <span
                        className={`text-lg font-bold text-white ${
                          canRoll
                            ? "cursor-pointer transition-colors hover:text-sky-400"
                            : ""
                        }`}
                        onClick={() =>
                          handleAbilityClick(ability.name, ability.key)
                        }
                        title={canRoll ? `Roll ${ability.name}` : undefined}
                      >
                        {formatModifier(currentValue)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Examples */}
                <div className="text-center">
                  {ability.examples.map((example) => (
                    <div key={example} className="text-xs text-slate-400">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
