"use client";

import { useMemo } from "react";
import { AbilityCard } from "~/components/AbilityCard";
import { Abilities, type Ability } from "~/lib/srd/abilities";
import { classes } from "~/lib/srd/classes";

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  game: {
    id: string;
    name: string;
  } | null;
}

interface CharacterCardsClientProps {
  characterId: string;
  character: Character;
}

export default function CharacterCardsClient({
  characterId: _characterId,
  character,
}: CharacterCardsClientProps) {
  const characterAbilities = useMemo(() => {
    if (!character?.class) return [];

    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === character.class.toLowerCase(),
    );

    if (!classData) return [];

    const domains = [classData.domain_1, classData.domain_2];

    return Abilities.filter((ability: Ability) => {
      const abilityLevel = parseInt(ability.level);
      return (
        domains.includes(ability.domain) && abilityLevel <= character.level
      );
    });
  }, [character?.class, character?.level]);

  if (!character) {
    return null; // Layout will handle the not found case
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Cards Content */}
      <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Available Abilities
        </h2>
        {characterAbilities.length === 0 ? (
          <p className="text-center text-slate-400">
            No abilities available for this character&apos;s domains and level.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {characterAbilities.map((ability: Ability, index: number) => (
              <AbilityCard
                key={index}
                name={ability.name}
                text={ability.text}
                tokens={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
