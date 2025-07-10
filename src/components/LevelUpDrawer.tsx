"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { TrendingUp, CheckCircle2, Plus, Minus } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

interface LevelUpOption {
  id: string;
  name: string;
  description: string;
  maxSelections: number;
  currentSelections: number;
}

interface LevelUpDrawerProps {
  characterId: string;
  currentLevel: number;
  characterName: string;
  isOwner: boolean;
}

export default function LevelUpDrawer({
  characterId,
  currentLevel,
  characterName,
  isOwner,
}: LevelUpDrawerProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Fetch character level history to count previous choices
  const { data: levelHistory } = api.character.getLevelHistory.useQuery(
    { id: characterId },
    { enabled: open }
  );

  const utils = api.useUtils();

  const levelUpMutation = api.character.levelUp.useMutation({
    onSuccess: () => {
      // Invalidate and refetch character data and level history
      void utils.character.getById.invalidate({ id: characterId });
      void utils.character.getLevelHistory.invalidate({ id: characterId });
      
      setOpen(false);
      setSelectedOptions([]);
    },
    onError: (error) => {
      console.error("Level up failed:", error);
    },
  });

  // Count previous choices from level history within current bracket
  const getPreviousChoiceCount = (choiceId: string): number => {
    if (!levelHistory) return 0;

    const choiceMap: Record<string, string> = {
      traits: "TRAIT_BONUS",
      hitpoints: "HIT_POINT_SLOT",
      stress: "STRESS_SLOT",
      experiences: "EXPERIENCE_BONUS",
      domain: "DOMAIN_CARD",
      evasion: "EVASION_BONUS",
    };

    const dbChoiceType = choiceMap[choiceId];
    if (!dbChoiceType) return 0;

    // Determine the level bracket for the next level (where they're leveling TO)
    const nextLevel = currentLevel + 1;
    let bracketStart: number;
    
    if (nextLevel >= 2 && nextLevel <= 4) {
      bracketStart = 2;
    } else if (nextLevel >= 5 && nextLevel <= 7) {
      bracketStart = 5;
    } else if (nextLevel >= 8 && nextLevel <= 10) {
      bracketStart = 8;
    } else {
      // Level 1 or beyond 10, no restrictions
      return 0;
    }

    // Only count choices made within the current bracket
    return levelHistory.reduce((count, level) => {
      if (level.level >= bracketStart && level.level < nextLevel) {
        return count + level.choices.filter(choice => choice.choice === dbChoiceType).length;
      }
      return count;
    }, 0);
  };

  const baseLevelUpOptions: Omit<LevelUpOption, "currentSelections">[] = [
    {
      id: "traits",
      name: "Character Traits",
      description:
        "Gain a +1 bonus to two unmarked character traits and mark them.",
      maxSelections: 3,
    },
    {
      id: "hitpoints",
      name: "Hit Points",
      description: "Permanently gain one Hit Point slot.",
      maxSelections: 2,
    },
    {
      id: "stress",
      name: "Stress Slots",
      description: "Permanently gain one Stress slot.",
      maxSelections: 2,
    },
    {
      id: "experiences",
      name: "Experiences",
      description: "Permanently gain a +1 bonus to two Experiences.",
      maxSelections: 1,
    },
    {
      id: "domain",
      name: "Domain Card",
      description:
        "Choose an additional domain card of your level or lower from a domain you have access to (up to level 4).",
      maxSelections: 1,
    },
    {
      id: "evasion",
      name: "Evasion",
      description: "Permanently gain a +1 bonus to your Evasion.",
      maxSelections: 1,
    },
  ];

  // Build level up options with current selections from previous levels
  const levelUpOptions: LevelUpOption[] = baseLevelUpOptions.map(option => ({
    ...option,
    currentSelections: getPreviousChoiceCount(option.id),
  }));

  // Count how many times each option has been selected
  const optionCounts = selectedOptions.reduce(
    (acc, optionId) => {
      acc[optionId] = (acc[optionId] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleOptionAdd = (optionId: string) => {
    const currentCount = optionCounts[optionId] ?? 0;
    const option = levelUpOptions.find((opt) => opt.id === optionId);

    if (!option) return;

    const totalPreviousSelections = option.currentSelections;
    const totalCurrentAndPreviousSelections = totalPreviousSelections + currentCount;

    // If we can still select more of this option (considering previous levels) and have room for selections
    if (totalCurrentAndPreviousSelections < option.maxSelections && selectedOptions.length < 2) {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const handleOptionRemove = (optionId: string) => {
    const currentCount = optionCounts[optionId] ?? 0;

    if (currentCount > 0) {
      // Remove one selection of this option
      const index = selectedOptions.findIndex((id) => id === optionId);
      if (index !== -1) {
        const newSelections = [...selectedOptions];
        newSelections.splice(index, 1);
        setSelectedOptions(newSelections);
      }
    }
  };

  const isOptionDisabled = (optionId: string) => {
    const option = levelUpOptions.find((opt) => opt.id === optionId);
    if (!option) return true;

    const currentCount = optionCounts[optionId] ?? 0;
    const totalPreviousSelections = option.currentSelections;
    const totalCurrentAndPreviousSelections = totalPreviousSelections + currentCount;

    // Disable if we've reached the max selections for this option (including previous levels)
    if (totalCurrentAndPreviousSelections >= option.maxSelections) return true;

    // Disable if we already have 2 total selections for this level-up
    if (selectedOptions.length >= 2) return true;

    return false;
  };

  const handleConfirmLevelUp = () => {
    if (selectedOptions.length !== 2) {
      return;
    }

    levelUpMutation.mutate({
      characterId,
      choices: selectedOptions as ("traits" | "hitpoints" | "stress" | "experiences" | "domain" | "evasion")[],
    });
  };

  if (!isOwner) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="bg-yellow-600 text-white hover:bg-yellow-700"
          size="sm"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Level Up
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col border-slate-700 bg-slate-800 text-white sm:max-w-lg">
        <SheetHeader className="mb-6 px-6 pt-6">
          <SheetTitle className="text-2xl font-bold text-white">
            Level Up {characterName}
          </SheetTitle>
          <SheetDescription className="text-lg text-slate-300">
            Level {currentLevel} → Level {currentLevel + 1}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden px-6">
          <div className="mb-4">
            <p className="text-sm text-slate-400">
              Select 2 bonuses for leveling up. Some options can be selected
              multiple times.
            </p>
            <p className="mt-2 text-sm font-medium text-sky-400">
              Selections: {selectedOptions.length}/2
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {levelUpOptions.map((option) => {
              const currentCount = optionCounts[option.id] ?? 0;
              const isAddDisabled = isOptionDisabled(option.id);
              const isRemoveDisabled = currentCount === 0;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "relative w-full rounded-lg border p-4 transition-all",
                    currentCount > 0
                      ? "border-sky-500 bg-slate-700"
                      : "border-slate-600 bg-slate-900",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        {option.name}
                        {option.maxSelections > 1 && (
                          <span className="ml-2 text-sm text-slate-400">
                            ({currentCount}/{option.maxSelections - option.currentSelections} remaining)
                          </span>
                        )}
                        {option.maxSelections === 1 && option.currentSelections > 0 && (
                          <span className="ml-2 text-sm text-red-400">
                            (Already selected)
                          </span>
                        )}
                      </h4>
                      <p className="mt-1 text-sm text-slate-300">
                        {option.description}
                      </p>
                    </div>
                    <div className="ml-3 flex items-center gap-2">
                      {currentCount > 0 && (
                        <div className="flex items-center">
                          <CheckCircle2 className="h-5 w-5 text-sky-500" />
                          {currentCount > 1 && (
                            <span className="ml-1 text-sm font-medium text-sky-500">
                              x{currentCount}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOptionRemove(option.id)}
                          disabled={isRemoveDisabled}
                          className={cn(
                            "rounded-full p-1 transition-all",
                            isRemoveDisabled
                              ? "cursor-not-allowed opacity-30"
                              : "bg-red-600 text-white hover:bg-red-700",
                          )}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOptionAdd(option.id)}
                          disabled={isAddDisabled}
                          className={cn(
                            "rounded-full p-1 transition-all",
                            isAddDisabled
                              ? "cursor-not-allowed opacity-30"
                              : "bg-green-600 text-white hover:bg-green-700",
                          )}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3 pb-8">
            <Button
              onClick={handleConfirmLevelUp}
              disabled={selectedOptions.length !== 2 || levelUpMutation.isPending}
              className="flex-1 bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-400"
            >
              {levelUpMutation.isPending ? "Leveling Up..." : "Confirm Level Up"}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                setSelectedOptions([]);
              }}
              variant="outline"
              className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
