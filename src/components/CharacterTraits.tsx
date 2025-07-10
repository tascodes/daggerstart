"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Swords, Edit3, Check, X, Circle, CheckCircle } from "lucide-react";
import { api } from "~/trpc/react";

interface CharacterTraitsProps {
  character: {
    id: string;
    agilityModifier: number;
    strengthModifier: number;
    finesseModifier: number;
    instinctModifier: number;
    presenceModifier: number;
    knowledgeModifier: number;
    agilityMarked: boolean;
    strengthMarked: boolean;
    finesseMarked: boolean;
    instinctMarked: boolean;
    presenceMarked: boolean;
    knowledgeMarked: boolean;
  };
  isOwner: boolean;
  game?: {
    id: string;
    name: string;
  } | null;
  onUpdate?: () => void;
}

interface Trait {
  name: string;
  key: keyof Pick<
    CharacterTraitsProps["character"],
    | "agilityModifier"
    | "strengthModifier"
    | "finesseModifier"
    | "instinctModifier"
    | "presenceModifier"
    | "knowledgeModifier"
  >;
  markedKey: keyof Pick<
    CharacterTraitsProps["character"],
    | "agilityMarked"
    | "strengthMarked"
    | "finesseMarked"
    | "instinctMarked"
    | "presenceMarked"
    | "knowledgeMarked"
  >;
  examples: string[];
}

const traits: Trait[] = [
  {
    name: "AGILITY",
    key: "agilityModifier",
    markedKey: "agilityMarked",
    examples: ["Sprint", "Leap", "Maneuver"],
  },
  {
    name: "STRENGTH",
    key: "strengthModifier",
    markedKey: "strengthMarked",
    examples: ["Lift", "Smash", "Grapple"],
  },
  {
    name: "FINESSE",
    key: "finesseModifier",
    markedKey: "finesseMarked",
    examples: ["Control", "Hide", "Tinker"],
  },
  {
    name: "INSTINCT",
    key: "instinctModifier",
    markedKey: "instinctMarked",
    examples: ["Perceive", "Sense", "Navigate"],
  },
  {
    name: "PRESENCE",
    key: "presenceModifier",
    markedKey: "presenceMarked",
    examples: ["Charm", "Perform", "Deceive"],
  },
  {
    name: "KNOWLEDGE",
    key: "knowledgeModifier",
    markedKey: "knowledgeMarked",
    examples: ["Recall", "Analyze", "Comprehend"],
  },
];

export default function CharacterTraits({
  character,
  isOwner,
  game,
  onUpdate,
}: CharacterTraitsProps) {
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

  const utils = api.useUtils();

  const updateTraitMarked = api.character.updateTraitMarked.useMutation({
    onMutate: async ({ id, trait, marked }) => {
      // Cancel any outgoing refetches
      await utils.character.getById.cancel({ id });

      // Snapshot the previous value
      const previousCharacter = utils.character.getById.getData({ id });

      // Optimistically update the cache
      if (previousCharacter) {
        const traitFieldMap = {
          agility: "agilityMarked",
          strength: "strengthMarked",
          finesse: "finesseMarked",
          instinct: "instinctMarked",
          presence: "presenceMarked",
          knowledge: "knowledgeMarked",
        } as const;

        const fieldName = traitFieldMap[trait];

        utils.character.getById.setData(
          { id },
          {
            ...previousCharacter,
            [fieldName]: marked,
          },
        );
      }

      // Return a context object with the snapshotted value
      return { previousCharacter };
    },
    onError: (err, { id }, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCharacter) {
        utils.character.getById.setData({ id }, context.previousCharacter);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success to ensure we have the latest data
      void utils.character.getById.invalidate({ id });
      onUpdate?.();
    },
  });

  const rollActionDice = api.game.rollActionDice.useMutation();

  const handleTraitClick = (
    traitName: string,
    traitKey: keyof Pick<
      CharacterTraitsProps["character"],
      | "agilityModifier"
      | "strengthModifier"
      | "finesseModifier"
      | "instinctModifier"
      | "presenceModifier"
      | "knowledgeModifier"
    >,
  ) => {
    if (!game || isEditing) return;

    const modifier = character[traitKey];

    rollActionDice.mutate({
      gameId: game.id,
      name: traitName,
      characterId: character.id,
      modifier: modifier,
    });
  };

  const handleTraitMarkToggle = (traitName: string, currentMarked: boolean) => {
    const traitMap = {
      AGILITY: "agility",
      STRENGTH: "strength",
      FINESSE: "finesse",
      INSTINCT: "instinct",
      PRESENCE: "presence",
      KNOWLEDGE: "knowledge",
    } as const;

    const traitKey = traitMap[traitName as keyof typeof traitMap];

    updateTraitMarked.mutate({
      id: character.id,
      trait: traitKey,
      marked: !currentMarked,
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
            Traits
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
          {traits.map((trait) => {
            const currentValue = character[trait.key];
            const editValue = editValues[trait.key];
            const isMarked = character[trait.markedKey];

            const canRoll = game && !isEditing;

            return (
              <div key={trait.name} className="flex flex-col items-center">
                {/* Trait Header with Checkbox */}
                <div
                  className={`mb-2 w-full rounded-t-lg bg-slate-700 px-3 py-2 text-center ${
                    canRoll
                      ? "cursor-pointer transition-colors hover:bg-slate-600"
                      : ""
                  }`}
                  onClick={() => handleTraitClick(trait.name, trait.key)}
                  title={canRoll ? `Roll ${trait.name}` : undefined}
                >
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-xs font-bold tracking-wide text-white uppercase">
                      {trait.name}
                    </h3>
                    {isOwner && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTraitMarkToggle(trait.name, isMarked);
                        }}
                        className="text-slate-400 hover:text-white"
                        title="Marked"
                        disabled={updateTraitMarked.isPending}
                      >
                        {isMarked ? (
                          <CheckCircle className="h-4 w-4 text-sky-400" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
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
                          handleInputChange(trait.key, e.target.value)
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
                        onClick={() => handleTraitClick(trait.name, trait.key)}
                        title={canRoll ? `Roll ${trait.name}` : undefined}
                      >
                        {formatModifier(currentValue)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Examples */}
                <div className="text-center">
                  {trait.examples.map((example) => (
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
