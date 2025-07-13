"use client";

import { useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { api } from "~/trpc/react";
import ArmorBar from "./ArmorBar";
import { Input } from "./ui/input";
import { Shield } from "lucide-react";
import { Armors } from "~/lib/srd/armor";

interface Character {
  id: string;
  evasion: number;
  armor: number;
  equippedArmorName?: string | null;
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

  const debouncedEvasionChange = useDebounceCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(20, value));
    debouncedEvasionUpdate(clampedValue);
  }, 500);

  const handleEvasionChange = (value: number) => {
    debouncedEvasionChange(value);
  };

  // Get equipped armor details
  const equippedArmor = character.equippedArmorName
    ? Armors.find((armor) => armor.name === character.equippedArmorName)
    : null;

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

        {/* Equipped Armor */}
        {equippedArmor && (
          <div className="rounded-lg border border-slate-600 bg-slate-700/50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                Equipped Armor
              </span>
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-white">
                {equippedArmor.name}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Tier:</span>
                  <span className="ml-2 text-white">{equippedArmor.tier}</span>
                </div>
                <div>
                  <span className="text-slate-400">Base Score:</span>
                  <span className="ml-2 text-white">
                    {equippedArmor.base_score}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Thresholds:</span>
                  <span className="ml-2 text-white">
                    {equippedArmor.base_thresholds}
                  </span>
                </div>
              </div>
              {equippedArmor.feat_name && (
                <div className="mt-3 rounded-lg bg-slate-600 p-3">
                  <div className="text-sm font-semibold text-yellow-400">
                    {equippedArmor.feat_name}
                  </div>
                  <div className="text-sm text-slate-300">
                    {equippedArmor.feat_text}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DefenseSection;
