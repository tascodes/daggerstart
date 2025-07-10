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
import { Badge } from "~/components/ui/badge";
import { TrendingUp, CheckCircle, Award } from "lucide-react";
import { api } from "~/trpc/react";

interface LevelHistoryDrawerProps {
  characterId: string;
  currentLevel: number;
  children: React.ReactNode;
}

export default function LevelHistoryDrawer({
  characterId,
  currentLevel,
  children,
}: LevelHistoryDrawerProps) {
  const [open, setOpen] = useState(false);

  const { data: levelHistory, isLoading } = api.character.getLevelHistory.useQuery(
    { id: characterId },
    { enabled: open }
  );

  const formatChoiceName = (choice: string): string => {
    const choiceNames: Record<string, string> = {
      TRAIT_BONUS: "Character Traits",
      HIT_POINT_SLOT: "Hit Points",
      STRESS_SLOT: "Stress Slots",
      EXPERIENCE_BONUS: "Experiences",
      DOMAIN_CARD: "Domain Card",
      EVASION_BONUS: "Evasion",
      SUBCLASS_CARD: "Subclass Card",
      PROFICIENCY: "Proficiency",
      MULTICLASS: "Multiclass",
    };
    return choiceNames[choice] ?? choice;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col border-slate-700 bg-slate-800 text-white sm:max-w-lg">
        <SheetHeader className="mb-6 px-6 pt-6">
          <SheetTitle className="text-2xl font-bold text-white">
            Level History
          </SheetTitle>
          <SheetDescription className="text-lg text-slate-300">
            Choices made at each level
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden px-6 pb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-slate-400">Loading level history...</div>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* Show levels 1 through current level */}
              {Array.from({ length: currentLevel }, (_, i) => i + 1).map((level) => {
                const levelData = levelHistory?.find((l) => l.level === level);
                const isSpecialLevel = level === 5 || level === 8;

                return (
                  <div
                    key={level}
                    className="rounded-lg border border-slate-600 bg-slate-700 p-4"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`${
                          isSpecialLevel
                            ? "bg-yellow-600 text-white"
                            : "bg-sky-500 text-white"
                        }`}
                      >
                        Level {level}
                      </Badge>
                      {isSpecialLevel && (
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <Award className="h-4 w-4" />
                          Traits Unmarked
                        </div>
                      )}
                    </div>

                    {levelData ? (
                      <div className="space-y-2">
                        {levelData.choices.length > 0 ? (
                          <>
                            <h4 className="text-sm font-semibold text-white">
                              Level-up Choices:
                            </h4>
                            <div className="space-y-1">
                              {levelData.choices.map((choice, index) => (
                                <div
                                  key={`${choice.id}-${index}`}
                                  className="flex items-center gap-2 text-sm text-slate-300"
                                >
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  {formatChoiceName(choice.choice)}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-slate-400">
                            No level-up choices recorded
                          </div>
                        )}

                        {/* Show trait increases if any */}
                        {levelData.traitIncreases.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-semibold text-white">
                              Trait Increases:
                            </h4>
                            <div className="space-y-1">
                              {levelData.traitIncreases.map((traitIncrease) => (
                                <div
                                  key={traitIncrease.id}
                                  className="flex items-center gap-2 text-sm text-slate-300"
                                >
                                  <TrendingUp className="h-4 w-4 text-blue-400" />
                                  {traitIncrease.trait}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show experience increases if any */}
                        {levelData.experienceIncreases.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-semibold text-white">
                              Experience Increases:
                            </h4>
                            <div className="space-y-1">
                              {levelData.experienceIncreases.map((expIncrease) => (
                                <div
                                  key={expIncrease.id}
                                  className="flex items-center gap-2 text-sm text-slate-300"
                                >
                                  <TrendingUp className="h-4 w-4 text-purple-400" />
                                  {expIncrease.experience}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">
                        {level === 1 ? "Starting level" : "Level gained outside system"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}