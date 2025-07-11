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
import { Input } from "~/components/ui/input";
import { TrendingUp, CheckCircle2, Plus, Minus, Star } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { classes } from "~/lib/srd/classes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
  const [newExperience, setNewExperience] = useState("");
  const [multiclassClass, setMulticlassClass] = useState("");

  // Fetch character level history to count previous choices
  const { data: historyData } = api.character.getLevelHistory.useQuery(
    { id: characterId },
    { enabled: open },
  );

  // Fetch next level to complete
  const { data: levelData } = api.character.getNextLevelToComplete.useQuery(
    { id: characterId },
    { enabled: open },
  );

  const utils = api.useUtils();

  const levelUpMutation = api.character.levelUp.useMutation({
    onSuccess: () => {
      // Invalidate and refetch character data and level history
      void utils.character.getById.invalidate({ id: characterId });
      void utils.character.getLevelHistory.invalidate({ id: characterId });
      void utils.character.getNextLevelToComplete.invalidate({
        id: characterId,
      });

      setOpen(false);
      setSelectedOptions([]);
      setNewExperience("");
      setMulticlassClass("");
    },
    onError: (error) => {
      console.error("Level up failed:", error);
    },
  });

  // Count previous choices from level history within current bracket
  const getPreviousChoiceCount = (choiceId: string): number => {
    if (!historyData?.levels) return 0;

    const choiceMap: Record<string, string> = {
      traits: "TRAIT_BONUS",
      hitpoints: "HIT_POINT_SLOT",
      stress: "STRESS_SLOT",
      experiences: "EXPERIENCE_BONUS",
      domain: "DOMAIN_CARD",
      evasion: "EVASION_BONUS",
      subclass: "SUBCLASS_CARD",
      proficiency: "PROFICIENCY",
      multiclass: "MULTICLASS",
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
    return historyData.levels.reduce((count, level) => {
      if (level.level >= bracketStart && level.level < nextLevel) {
        return (
          count +
          level.choices.filter((choice) => choice.choice === dbChoiceType)
            .length
        );
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

  // Additional options for levels 5-10
  const advancedLevelUpOptions: Omit<LevelUpOption, "currentSelections">[] = [
    {
      id: "subclass",
      name: "Upgraded Subclass Card",
      description: "Take an upgraded subclass card.",
      maxSelections: 1,
    },
    {
      id: "proficiency",
      name: "Proficiency Increase",
      description: "Increase your Proficiency by +1. (Counts as 2 choices)",
      maxSelections: 1,
    },
    {
      id: "multiclass",
      name: "Multiclass",
      description:
        "Choose an additional class for your character. (Counts as 2 choices)",
      maxSelections: 1,
    },
  ];

  // Use the next level that needs to be completed, or fall back to next level
  // If there are incomplete levels, always use nextLevelToComplete
  // If no incomplete levels, then level up normally to next level
  const targetLevel = levelData?.hasIncompletelevels
    ? levelData.nextLevelToComplete!
    : currentLevel + 1;

  // Get level tier-specific history for advanced options
  const getTierSpecificHistory = () => {
    if (!historyData?.levels)
      return { hasSubclass: false, hasMulticlass: false };

    const tierStart = targetLevel >= 8 ? 8 : targetLevel >= 5 ? 5 : 2;
    const tierLevels = historyData.levels.filter(
      (level) => level.level >= tierStart && level.level < targetLevel,
    );

    const hasSubclass = tierLevels.some((level) =>
      level.choices.some((choice) => choice.choice === "SUBCLASS_CARD"),
    );
    const hasMulticlass = historyData.levels.some((level) =>
      level.choices.some((choice) => choice.choice === "MULTICLASS"),
    );

    return { hasSubclass, hasMulticlass };
  };

  const { hasSubclass, hasMulticlass } = getTierSpecificHistory();

  // Combine base and advanced options for levels 5-10
  const allOptions =
    targetLevel >= 5
      ? [...baseLevelUpOptions, ...advancedLevelUpOptions]
      : baseLevelUpOptions;

  // Build level up options with current selections from previous levels
  const levelUpOptions: LevelUpOption[] = allOptions.map((option) => ({
    ...option,
    currentSelections:
      option.id === "subclass" ||
      option.id === "proficiency" ||
      option.id === "multiclass"
        ? 0 // These are tier/forever restricted, not count-based
        : getPreviousChoiceCount(option.id),
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

    // Special handling for proficiency and multiclass (count as 2 choices each)
    if (optionId === "proficiency" || optionId === "multiclass") {
      if (selectedOptions.length === 0) {
        setSelectedOptions([optionId]);
      }
      return;
    }

    const totalPreviousSelections = option.currentSelections;
    const totalCurrentAndPreviousSelections =
      totalPreviousSelections + currentCount;

    // Check if we can add this option
    const maxSelections = 2;
    const hasProficiencyOrMulticlass = selectedOptions.some(
      (opt) => opt === "proficiency" || opt === "multiclass",
    );

    if (hasProficiencyOrMulticlass) {
      // Can't add any more options if proficiency or multiclass is selected
      return;
    }

    // If we can still select more of this option (considering previous levels) and have room for selections
    if (
      totalCurrentAndPreviousSelections < option.maxSelections &&
      selectedOptions.length < maxSelections
    ) {
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

    // Advanced option rules for levels 5-10
    if (targetLevel >= 5) {
      // If multiclass was selected in any previous level, it can never be selected again
      if (optionId === "multiclass" && hasMulticlass) return true;

      // If subclass was selected in this tier, multiclass is disabled until next tier
      if (optionId === "multiclass" && hasSubclass) return true;

      // If multiclass was selected in this tier, subclass is disabled until next tier
      if (optionId === "subclass" && hasMulticlass) return true;

      // Disable proficiency and multiclass if any other option is already selected
      if (
        (optionId === "proficiency" || optionId === "multiclass") &&
        selectedOptions.length > 0 &&
        !selectedOptions.includes(optionId)
      ) {
        return true;
      }

      // Disable all other options if proficiency or multiclass is selected
      if (optionId !== "proficiency" && optionId !== "multiclass") {
        const hasProficiencyOrMulticlass = selectedOptions.some(
          (opt) => opt === "proficiency" || opt === "multiclass",
        );
        if (hasProficiencyOrMulticlass) return true;
      }
    }

    const currentCount = optionCounts[optionId] ?? 0;
    const totalPreviousSelections = option.currentSelections;
    const totalCurrentAndPreviousSelections =
      totalPreviousSelections + currentCount;

    // Disable if we've reached the max selections for this option (including previous levels)
    if (totalCurrentAndPreviousSelections >= option.maxSelections) return true;

    // For proficiency and multiclass, they can only be selected once and count as 2 choices
    if (
      (optionId === "proficiency" || optionId === "multiclass") &&
      currentCount > 0
    )
      return true;

    // Disable if we already have 2 total selections for this level-up (unless it's proficiency/multiclass)
    if (selectedOptions.length >= 2 && !selectedOptions.includes(optionId))
      return true;

    return false;
  };

  const requiresNewExperience =
    targetLevel === 2 || targetLevel === 5 || targetLevel === 8;

  const handleConfirmLevelUp = () => {
    const hasProficiencyOrMulticlass = selectedOptions.some(
      (opt) => opt === "proficiency" || opt === "multiclass",
    );
    const hasMulticlassSelection = selectedOptions.includes("multiclass");

    // Validation: either 2 normal choices, or 1 special choice (proficiency/multiclass)
    if (!hasProficiencyOrMulticlass && selectedOptions.length !== 2) {
      return;
    }

    if (hasProficiencyOrMulticlass && selectedOptions.length !== 1) {
      return;
    }

    if (requiresNewExperience && !newExperience.trim()) {
      return;
    }

    if (hasMulticlassSelection && !multiclassClass.trim()) {
      return;
    }

    levelUpMutation.mutate({
      characterId,
      targetLevel,
      choices: selectedOptions as (
        | "traits"
        | "hitpoints"
        | "stress"
        | "experiences"
        | "domain"
        | "evasion"
        | "subclass"
        | "proficiency"
        | "multiclass"
      )[],
      newExperience: requiresNewExperience ? newExperience.trim() : undefined,
      multiclassClass: hasMulticlassSelection
        ? multiclassClass.trim()
        : undefined,
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
            Level {currentLevel} → Level {targetLevel}
            {levelData?.hasIncompletelevels && (
              <div className="mt-1 text-sm text-yellow-400">
                Completing missing level progression
              </div>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden px-6">
          <div className="mb-4">
            <p className="text-sm text-slate-400">
              Select 2 bonuses for leveling up. Some options can be selected
              multiple times.
            </p>
            <p className="mt-2 text-sm font-medium text-sky-400">
              Selections: {selectedOptions.length}/
              {selectedOptions.some(
                (opt) => opt === "proficiency" || opt === "multiclass",
              )
                ? "1 (special)"
                : "2"}
            </p>
          </div>

          {/* Show automatic bonuses for levels 2, 5, 8 */}
          {requiresNewExperience && (
            <div className="mb-4 rounded-lg border border-yellow-600 bg-yellow-900/20 p-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-400">
                <Star className="h-4 w-4" />
                Automatic Bonuses (Level {targetLevel})
              </h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Gain an additional Experience at +2
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Gain a +1 bonus to Proficiency
                </div>
              </div>
            </div>
          )}

          {/* Experience input for levels 2, 5, 8 */}
          {requiresNewExperience && (
            <div className="mb-4 rounded-lg border border-sky-600 bg-sky-900/20 p-4">
              <h4 className="mb-2 text-sm font-semibold text-sky-400">
                New Experience Required
              </h4>
              <p className="mb-3 text-sm text-slate-300">
                Enter the name of your new experience (you&apos;ll gain a +2
                bonus with it):
              </p>
              <Input
                value={newExperience}
                onChange={(e) => setNewExperience(e.target.value)}
                placeholder="e.g., Climbing, Swimming, History..."
                className="border-slate-600 bg-slate-700 text-white placeholder:text-slate-400"
                maxLength={50}
              />
            </div>
          )}

          {/* Multiclass selection */}
          {selectedOptions.includes("multiclass") && (
            <div className="mb-4 rounded-lg border border-purple-600 bg-purple-900/20 p-4">
              <h4 className="mb-2 text-sm font-semibold text-purple-400">
                Multiclass Selection Required
              </h4>
              <p className="mb-3 text-sm text-slate-300">
                Choose an additional class for your character:
              </p>
              <Select
                value={multiclassClass}
                onValueChange={setMulticlassClass}
              >
                <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                  <SelectValue placeholder="Select a class to multiclass into" />
                </SelectTrigger>
                <SelectContent className="border-slate-600 bg-slate-700">
                  {classes.map((classItem) => (
                    <SelectItem
                      key={classItem.name}
                      value={classItem.name.toLowerCase()}
                      className="text-white focus:bg-slate-600"
                    >
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
                            ({currentCount}/
                            {option.maxSelections - option.currentSelections}{" "}
                            remaining)
                          </span>
                        )}
                        {option.maxSelections === 1 &&
                          option.currentSelections > 0 && (
                            <span className="ml-2 text-sm text-red-400">
                              (Already selected)
                            </span>
                          )}
                        {/* Special indicators for advanced options */}
                        {option.id === "subclass" && hasSubclass && (
                          <span className="ml-2 text-sm text-orange-400">
                            (Taken this tier)
                          </span>
                        )}
                        {option.id === "multiclass" && hasMulticlass && (
                          <span className="ml-2 text-sm text-red-400">
                            (Already multiclassed)
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
              disabled={
                levelUpMutation.isPending ||
                (requiresNewExperience && !newExperience.trim()) ||
                (selectedOptions.includes("multiclass") &&
                  !multiclassClass.trim()) ||
                (selectedOptions.some(
                  (opt) => opt === "proficiency" || opt === "multiclass",
                )
                  ? selectedOptions.length !== 1
                  : selectedOptions.length !== 2)
              }
              className="flex-1 bg-sky-500 text-white hover:bg-sky-600 disabled:bg-slate-700 disabled:text-slate-400"
            >
              {levelUpMutation.isPending
                ? "Leveling Up..."
                : "Confirm Level Up"}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                setSelectedOptions([]);
                setNewExperience("");
                setMulticlassClass("");
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
