"use client";

import { useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";
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
  const utils = api.useUtils();

  const updateHealthStat = api.character.updateHealthStat.useMutation({
    onMutate: async (variables) => {
      await utils.character.getById.cancel({ id: character.id });
      const previousCharacter = utils.character.getById.getData({
        id: character.id,
      });

      if (previousCharacter) {
        utils.character.getById.setData(
          { id: character.id },
          {
            ...previousCharacter,
            [variables.field]: variables.value,
          },
        );
      }

      return { previousCharacter };
    },
    onError: (error, variables, context) => {
      if (context?.previousCharacter) {
        utils.character.getById.setData(
          { id: character.id },
          context.previousCharacter,
        );
      }
    },
    onSettled: () => {
      void utils.character.getById.invalidate({ id: character.id });
      onUpdate();
    },
  });

  const updateDefenseStat = api.character.updateDefenseStat.useMutation({
    onMutate: async (variables) => {
      await utils.character.getById.cancel({ id: character.id });
      const previousCharacter = utils.character.getById.getData({
        id: character.id,
      });

      if (previousCharacter) {
        utils.character.getById.setData(
          { id: character.id },
          {
            ...previousCharacter,
            [variables.field]: variables.value,
          },
        );
      }

      return { previousCharacter };
    },
    onError: (error, variables, context) => {
      if (context?.previousCharacter) {
        utils.character.getById.setData(
          { id: character.id },
          context.previousCharacter,
        );
      }
    },
    onSettled: () => {
      void utils.character.getById.invalidate({ id: character.id });
      onUpdate();
    },
  });

  const handleArmorChange = (value: number) => {
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

  const debouncedEvasionChange = useDebounceCallback(
    (value: number) => {
      const clampedValue = Math.max(0, Math.min(20, value));
      debouncedEvasionUpdate(clampedValue);
    },
    500,
  );

  const handleEvasionChange = (value: number) => {
    debouncedEvasionChange(value);
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
              value={character.evasion}
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
          value={character.armor}
          maxValue={6}
          onValueChange={handleArmorChange}
          disabled={!isOwner}
        />
      </div>
    </div>
  );
};

export default DefenseSection;
