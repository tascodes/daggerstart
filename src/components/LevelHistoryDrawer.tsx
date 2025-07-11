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
import { TrendingUp, CheckCircle, Award, Star } from "lucide-react";
import { api } from "~/trpc/react";
import { classes } from "~/lib/srd/classes";

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

  const { data: historyData, isLoading } =
    api.character.getLevelHistory.useQuery(
      { id: characterId },
      { enabled: open },
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

  const getFormattedClassName = (className: string): string => {
    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === className.toLowerCase(),
    );
    return classData?.name ?? className;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
              {Array.from({ length: currentLevel }, (_, i) => i + 1).map(
                (level) => {
                  const levelData = historyData?.levels.find(
                    (l) => l.level === level,
                  );

                  // Determine tier label
                  const getTierLabel = (level: number): string | null => {
                    switch (level) {
                      case 1:
                        return "Tier 1";
                      case 2:
                        return "Tier 2";
                      case 5:
                        return "Tier 3";
                      case 8:
                        return "Tier 4";
                      default:
                        return null;
                    }
                  };

                  const tierLabel = getTierLabel(level);

                  return (
                    <div
                      key={level}
                      className="rounded-lg border border-slate-600 bg-slate-700 p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-sky-500 text-white"
                        >
                          Level {level}
                        </Badge>
                        {tierLabel && (
                          <div className="flex items-center gap-1 text-xs text-purple-400">
                            <Award className="h-4 w-4" />
                            {tierLabel}
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

                          {/* Show automatic bonuses for levels 2, 5, 8 */}
                          {(level === 2 || level === 5 || level === 8) && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold text-white">
                                Automatic Bonuses:
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

                          {/* Show trait increases if any */}
                          {levelData.traitIncreases.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold text-white">
                                Trait Increases:
                              </h4>
                              <div className="space-y-1">
                                {levelData.traitIncreases.map(
                                  (traitIncrease) => (
                                    <div
                                      key={traitIncrease.id}
                                      className="flex items-center gap-2 text-sm text-slate-300"
                                    >
                                      <TrendingUp className="h-4 w-4 text-blue-400" />
                                      {traitIncrease.trait}
                                    </div>
                                  ),
                                )}
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
                                {levelData.experienceIncreases.map(
                                  (expIncrease) => (
                                    <div
                                      key={expIncrease.id}
                                      className="flex items-center gap-2 text-sm text-slate-300"
                                    >
                                      <TrendingUp className="h-4 w-4 text-purple-400" />
                                      {expIncrease.experience}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {/* Show new experiences gained at this level */}
                          {historyData?.experiences && 
                            historyData.experiences.filter(exp => exp.level === level).length > 0 && 
                            level > 1 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold text-white">
                                New Experiences:
                              </h4>
                              <div className="space-y-1">
                                {historyData.experiences
                                  .filter(exp => exp.level === level)
                                  .map((exp) => (
                                  <div
                                    key={exp.id}
                                    className="flex items-center gap-2 text-sm text-slate-300"
                                  >
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    {exp.name} +{exp.bonus}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">
                          {level === 1 ? (
                            <div className="space-y-2">
                              <div>
                                <h4 className="text-sm font-semibold text-white">
                                  Starting Class:
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-slate-300">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  {historyData?.characterClass &&
                                    getFormattedClassName(
                                      historyData.characterClass,
                                    )}
                                </div>
                              </div>
                              {historyData?.experiences && 
                                historyData.experiences.filter(exp => exp.level === 1).length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-white">
                                      Starting Experiences:
                                    </h4>
                                    <div className="space-y-1">
                                      {historyData.experiences
                                        .filter(exp => exp.level === 1)
                                        .map((exp) => (
                                        <div
                                          key={exp.id}
                                          className="flex items-center gap-2 text-sm text-slate-300"
                                        >
                                          <CheckCircle className="h-4 w-4 text-green-400" />
                                          {exp.name} +{exp.bonus}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ) : (
                            "Level gained outside system"
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
