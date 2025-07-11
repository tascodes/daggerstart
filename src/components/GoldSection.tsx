"use client";

import { useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { api } from "~/trpc/react";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

interface Character {
  id: string;
  goldHandfuls: number;
  goldBags: number;
  goldChest: boolean;
}

interface GoldSectionProps {
  character: Character;
  isOwner: boolean;
  onUpdate: () => void;
}

const GoldSection = ({ character, isOwner, onUpdate }: GoldSectionProps) => {
  const utils = api.useUtils();

  const updateGoldStat = api.character.updateGoldStat.useMutation({
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

  const updateGoldChest = api.character.updateGoldChest.useMutation({
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
            goldChest: variables.hasChest,
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

  const debouncedGoldUpdate = useCallback(
    (field: "goldHandfuls" | "goldBags", value: number) => {
      updateGoldStat.mutate({
        id: character.id,
        field,
        value,
      });
    },
    [character.id, updateGoldStat],
  );

  const debouncedHandfulsUpdate = useDebounceCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(10, value));
    debouncedGoldUpdate("goldHandfuls", clampedValue);
  }, 500);

  const debouncedBagsUpdate = useDebounceCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(10, value));
    debouncedGoldUpdate("goldBags", clampedValue);
  }, 500);

  const handleHandfulsChange = (value: number) => {
    debouncedHandfulsUpdate(value);
  };

  const handleBagsChange = (value: number) => {
    debouncedBagsUpdate(value);
  };

  const handleChestChange = (checked: boolean) => {
    updateGoldChest.mutate({
      id: character.id,
      hasChest: checked,
    });
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        <div className="clip-path-arrow bg-slate-600 px-4 py-2 text-lg font-bold text-white">
          GOLD
        </div>
      </div>

      <div className="flex gap-2">
        {/* Handfuls */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-slate-300">Handfuls</label>
          {isOwner ? (
            <Input
              type="number"
              min="0"
              max="10"
              value={character.goldHandfuls}
              onChange={(e) =>
                handleHandfulsChange(parseInt(e.target.value) || 0)
              }
              className="h-10 w-16 border-slate-600 bg-slate-700 text-center text-lg font-bold text-white"
            />
          ) : (
            <div className="flex h-10 w-16 items-center justify-center rounded border border-slate-600 bg-slate-700 text-lg font-bold text-white">
              {character.goldHandfuls}
            </div>
          )}
        </div>

        {/* Bags */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-slate-300">Bags</label>
          {isOwner ? (
            <Input
              type="number"
              min="0"
              max="10"
              value={character.goldBags}
              onChange={(e) => handleBagsChange(parseInt(e.target.value) || 0)}
              className="h-10 w-16 border-slate-600 bg-slate-700 text-center text-lg font-bold text-white"
            />
          ) : (
            <div className="flex h-10 w-16 items-center justify-center rounded border border-slate-600 bg-slate-700 text-lg font-bold text-white">
              {character.goldBags}
            </div>
          )}
        </div>

        {/* Chest */}
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-medium text-slate-300">Chest</label>
          {isOwner ? (
            <div className="flex h-10 items-center justify-center">
              <Checkbox
                checked={character.goldChest}
                onCheckedChange={handleChestChange}
                className="h-6 w-6 border-slate-600 data-[state=checked]:border-yellow-600 data-[state=checked]:bg-yellow-600"
              />
            </div>
          ) : (
            <div className="flex h-10 items-center justify-center">
              <div
                className={`h-6 w-6 rounded border-2 ${
                  character.goldChest
                    ? "border-yellow-600 bg-yellow-600"
                    : "border-slate-600"
                }`}
              >
                {character.goldChest && (
                  <svg
                    className="m-0.5 h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoldSection;
