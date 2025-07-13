"use client";

import { Sword, Dices, ActivitySquare } from "lucide-react";
import { Weapons, type Weapon } from "@/lib/srd/weapons";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Character } from "@prisma/client";

// Extended character type with computed proficiency
type CharacterWithProficiency = Character & {
  proficiency?: number;
};

interface EquippedWeaponSectionProps {
  character: CharacterWithProficiency;
}

const WeaponCard = ({
  weapon,
  secondary = false,
  character,
  onAttack,
  onDamage,
}: {
  weapon: Weapon;
  secondary?: boolean;
  character: CharacterWithProficiency;
  onAttack: (weaponName: string, modifier: number) => void;
  onDamage: (weapon: Weapon, damage: string) => void;
}) => {
  // Get the appropriate modifier based on weapon trait
  const getTraitModifier = () => {
    const trait = weapon.trait.toLowerCase();
    switch (trait) {
      case "agility":
        return character.agilityModifier;
      case "strength":
        return character.strengthModifier;
      case "finesse":
        return character.finesseModifier;
      case "instinct":
        return character.instinctModifier;
      case "presence":
        return character.presenceModifier;
      case "knowledge":
        return character.knowledgeModifier;
      default:
        return 0;
    }
  };

  const traitModifier = getTraitModifier();
  const proficiency = character.proficiency || 1; // Fallback to 1 if not available

  const damage = proficiency + weapon.damage.replace(/\s*(phy|mag)$/i, "");

  return (
    <div className="rounded-lg border border-slate-600 bg-slate-700/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Sword className="h-4 w-4 text-sky-400" />
        <span className="text-sm font-medium text-sky-400">
          {secondary ? "Secondary" : "Primary"} Weapon
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-lg font-semibold text-white">
              {weapon.name}
            </div>
            <div className="text-sm text-slate-300">
              {weapon.burden}{" "}
              {weapon.range === "Very Close" || weapon.range === "Melee"
                ? "Melee"
                : "Ranged"}{" "}
              Weapon {weapon.range !== "Melee" && `(${weapon.range})`}
            </div>
            {character.gameId && (
              <div className="mt-2 flex items-center gap-2">
                <Button
                  onClick={() => onAttack(weapon.name, traitModifier)}
                  size="sm"
                  className="bg-sky-600 hover:bg-sky-700"
                  title={`Attack with ${weapon.name} (${traitModifier >= 0 ? "+" : ""}${traitModifier})`}
                >
                  <Dices className="h-4 w-4" />
                  <span className="ml-1">Attack</span>
                </Button>
                <span className="text-xs text-slate-500">
                  {weapon.trait} {traitModifier >= 0 ? "+" : ""}
                  {traitModifier}
                </span>
                <Button
                  onClick={() => onDamage(weapon, damage)}
                  size="sm"
                  className="bg-red-700 hover:bg-red-800"
                  title={`Roll damage: ${damage} ${weapon.physical_or_magical}`}
                >
                  <ActivitySquare className="h-4 w-4" />
                  <span className="ml-1">
                    {damage} {weapon.physical_or_magical}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
        {weapon.feat_name && (
          <div className="mt-3 rounded-lg bg-slate-600 p-3">
            <div className="text-sm font-semibold text-sky-400">
              {weapon.feat_name}
            </div>
            <div className="text-sm text-slate-300">{weapon.feat_text}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const EquippedWeaponSection = ({ character }: EquippedWeaponSectionProps) => {
  const rollActionDice = api.game.rollActionDice.useMutation();
  const rollCustomDice = api.game.rollCustomDice.useMutation();

  const handleAttack = (weaponName: string, modifier: number) => {
    if (!character.gameId) return;

    rollActionDice.mutate({
      gameId: character.gameId,
      name: `Attack with ${weaponName}`,
      characterId: character.id,
      modifier,
    });
  };

  const handleDamage = (weapon: Weapon, damageString: string) => {
    if (!character.gameId) return;

    rollCustomDice.mutate({
      gameId: character.gameId,
      name: `${weapon.name} Damage`,
      diceExpression: damageString,
      characterId: character.id,
    });
  };

  // Get equipped weapon details
  const equippedPrimaryWeapon = character.equippedPrimaryWeapon
    ? Weapons.find((weapon) => weapon.name === character.equippedPrimaryWeapon)
    : null;

  const equippedSecondaryWeapon = character.equippedSecondaryWeapon
    ? Weapons.find(
        (weapon) => weapon.name === character.equippedSecondaryWeapon,
      )
    : null;

  if (!equippedPrimaryWeapon && !equippedSecondaryWeapon) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        <div className="clip-path-arrow bg-slate-600 px-4 py-2 text-lg font-bold text-white">
          WEAPON
        </div>
      </div>

      <div className="space-y-4">
        {/* Primary Weapon */}
        {equippedPrimaryWeapon && (
          <WeaponCard
            weapon={equippedPrimaryWeapon}
            character={character}
            onAttack={handleAttack}
            onDamage={handleDamage}
          />
        )}

        {/* Secondary Weapon */}
        {equippedSecondaryWeapon && (
          <WeaponCard
            secondary={true}
            weapon={equippedSecondaryWeapon}
            character={character}
            onAttack={handleAttack}
            onDamage={handleDamage}
          />
        )}
      </div>
    </div>
  );
};

export default EquippedWeaponSection;
