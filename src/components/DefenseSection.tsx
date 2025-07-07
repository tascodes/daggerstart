"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "~/trpc/react";
import ArmorBar from "./ArmorBar";
import { Input } from "./ui/input";

interface Character {
  id: string;
  evasion: number;
  armor: number;
}

interface DefenseSectionProps {
  character: Character;
  isOwner: boolean;
  onUpdate: () => void;
}

const DefenseSection = ({
  character,
  isOwner,
  onUpdate,
}: DefenseSectionProps) => {
  // Optimistic state for defense stats
  const [optimisticEvasion, setOptimisticEvasion] = useState(character.evasion);
  const [optimisticArmor, setOptimisticArmor] = useState(character.armor);
  const evasionDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Update optimistic state when character data changes
  useEffect(() => {
    setOptimisticEvasion(character.evasion);
    setOptimisticArmor(character.armor);
  }, [character.evasion, character.armor]);

  const updateHealthStat = api.character.updateHealthStat.useMutation({
    onSuccess: () => {
      onUpdate();
    },
    onError: () => {
      // Revert optimistic update on error
      setOptimisticArmor(character.armor);
    },
  });

  const updateDefenseStat = api.character.updateDefenseStat.useMutation({
    onSuccess: () => {
      onUpdate();
    },
    onError: () => {
      // Revert optimistic update on error
      setOptimisticEvasion(character.evasion);
    },
  });

  const handleArmorChange = (value: number) => {
    // Immediately update the optimistic state
    setOptimisticArmor(value);

    // Make the API call in the background
    updateHealthStat.mutate({
      id: character.id,
      field: "armor",
      value,
    });
  };

  const debouncedEvasionUpdate = useCallback(
    (value: number) => {
      updateDefenseStat.mutate({
        id: character.id,
        field: "evasion",
        value,
      });
    },
    [character.id, updateDefenseStat],
  );

  const handleEvasionChange = (value: number) => {
    const clampedValue = Math.max(0, Math.min(20, value));

    // Immediately update the optimistic state
    setOptimisticEvasion(clampedValue);

    // Clear existing timer
    if (evasionDebounceTimer.current) {
      clearTimeout(evasionDebounceTimer.current);
    }

    // Set new timer for API call (500ms debounce)
    const newTimer = setTimeout(() => {
      debouncedEvasionUpdate(clampedValue);
    }, 500);

    evasionDebounceTimer.current = newTimer;
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        <div className="clip-path-arrow bg-slate-600 px-4 py-2 text-lg font-bold text-white">
          DEFENSE
        </div>
      </div>

      <div className="space-y-6">
        {/* Evasion Input */}
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm font-medium text-slate-300">
            Evasion
          </label>
          {isOwner ? (
            <Input
              type="number"
              min="0"
              max="50"
              value={optimisticEvasion}
              onChange={(e) =>
                handleEvasionChange(parseInt(e.target.value) || 0)
              }
              className="h-12 w-20 border-slate-600 bg-slate-700 text-center text-2xl font-bold text-white"
            />
          ) : (
            <div className="flex h-12 w-20 items-center justify-center rounded border border-slate-600 bg-slate-700 text-2xl font-bold text-white">
              {character.evasion}
            </div>
          )}
        </div>

        {/* Armor Bar */}
        <ArmorBar
          value={optimisticArmor}
          maxValue={6}
          onValueChange={handleArmorChange}
          disabled={!isOwner}
        />
      </div>
    </div>
  );
};

export default DefenseSection;
