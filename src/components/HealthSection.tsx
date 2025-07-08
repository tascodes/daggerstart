"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import HealthBar from "./HealthBar";
import StressBar from "./StressBar";
import HopeBar from "./HopeBar";
import { Input } from "./ui/input";
import type { Character } from "@prisma/client";
// Removed unused import
import { classes } from "~/lib/srd/classes";

interface HealthSectionProps {
  character: Character;
  isOwner: boolean;
  onUpdate: () => void;
}

const HealthSection = ({
  character,
  isOwner,
  onUpdate,
}: HealthSectionProps) => {
  const [majorThreshold, setMajorThreshold] = useState(
    character.majorDamageThreshold ?? "",
  );
  const [severeThreshold, setSevereThreshold] = useState(
    character.severeDamageThreshold ?? "",
  );

  // Helper function to derive maxHp from class data
  const getMaxHp = (character: Character): number => {
    // If character has maxHp in database, use it
    if (character.maxHp && character.maxHp > 0) {
      return character.maxHp;
    }

    // Otherwise derive from class data
    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === character.class.toLowerCase(),
    );

    return classData ? parseInt(classData.hp, 10) : 5; // fallback to 5
  };

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

  const updateDamageThreshold = api.character.updateDamageThreshold.useMutation(
    {
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
              [variables.field]: variables.value ?? null,
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
    },
  );

  const handleHealthStatChange = (
    field: "hp" | "stress" | "hope",
    value: number,
  ) => {
    updateHealthStat.mutate({
      id: character.id,
      field,
      value,
    });
  };

  const handleThresholdChange = (
    field: "majorDamageThreshold" | "severeDamageThreshold",
    value: string,
  ) => {
    updateDamageThreshold.mutate({
      id: character.id,
      field,
      value: value || undefined,
    });
  };

  const handleMajorThresholdBlur = () => {
    if (majorThreshold !== (character.majorDamageThreshold ?? "")) {
      handleThresholdChange("majorDamageThreshold", majorThreshold);
    }
  };

  const handleSevereThresholdBlur = () => {
    if (severeThreshold !== (character.severeDamageThreshold ?? "")) {
      handleThresholdChange("severeDamageThreshold", severeThreshold);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[60%_calc(37%+2px)]">
      {/* Damage & Health Section */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-4">
          <div className="clip-path-arrow bg-slate-600 px-4 py-2 text-lg font-bold text-white">
            DAMAGE &amp; HEALTH
          </div>
        </div>
        <p className="mb-6 text-sm text-slate-400">
          Add your current level to your damage thresholds.
        </p>

        {/* Damage Thresholds */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-slate-600 p-3 text-center text-white">
            <div className="font-bold">MINOR DAMAGE</div>
            <div className="mt-1 text-sm">Mark 1 HP</div>
          </div>
          <div className="relative bg-slate-600 p-3 text-center text-white">
            <div className="font-bold">MAJOR DAMAGE</div>
            <div className="mt-1 text-sm">Mark 2 HP</div>
            {isOwner && (
              <Input
                className="mt-2 h-8 border-slate-600 bg-slate-700 text-center text-sm text-white"
                placeholder="Threshold"
                value={majorThreshold}
                onChange={(e) => setMajorThreshold(e.target.value)}
                onBlur={handleMajorThresholdBlur}
                disabled={updateDamageThreshold.isPending}
              />
            )}
            {!isOwner && character.majorDamageThreshold && (
              <div className="mt-2 text-sm font-medium text-yellow-400">
                {character.majorDamageThreshold}
              </div>
            )}
          </div>
          <div className="bg-slate-600 p-3 text-center text-white">
            <div className="font-bold">SEVERE DAMAGE</div>
            <div className="mt-1 text-sm">Mark 3 HP</div>
            {isOwner && (
              <Input
                className="mt-2 h-8 border-slate-600 bg-slate-700 text-center text-sm text-white"
                placeholder="Threshold"
                value={severeThreshold}
                onChange={(e) => setSevereThreshold(e.target.value)}
                onBlur={handleSevereThresholdBlur}
                disabled={updateDamageThreshold.isPending}
              />
            )}
            {!isOwner && character.severeDamageThreshold && (
              <div className="mt-2 text-sm font-medium text-yellow-400">
                {character.severeDamageThreshold}
              </div>
            )}
          </div>
        </div>

        {/* Health Bars */}
        <div className="space-y-4">
          <HealthBar
            label="HP"
            value={character.hp}
            maxValue={getMaxHp(character)}
            onValueChange={(value) => handleHealthStatChange("hp", value)}
            disabled={!isOwner}
          />
          <StressBar
            label="STRESS"
            value={character.stress}
            maxValue={6}
            onValueChange={(value) => handleHealthStatChange("stress", value)}
            disabled={!isOwner}
          />
        </div>
      </div>

      {/* Hope Section */}
      <HopeBar
        value={character.hope}
        _class={character.class}
        maxValue={6}
        onValueChange={(value) => handleHealthStatChange("hope", value)}
        disabled={!isOwner}
      />
    </div>
  );
};

export default HealthSection;
