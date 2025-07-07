"use client";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { User, Crown, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { subclassesByClass, type ClassKeys } from "~/app/pc/new/constants";
import DomainBadge from "~/components/DomainBadge";
import { classes } from "~/lib/srd/classes";

interface CharacterHeaderProps {
  character: {
    id: string;
    name: string;
    pronouns?: string | null;
    level: number;
    class: string;
    subclass: string;
    ancestry: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
    game?: {
      id: string;
      name: string;
    } | null;
  };
  isOwner: boolean;
}

export default function CharacterHeader({
  character,
  isOwner,
}: CharacterHeaderProps) {
  // Helper function to get nice subclass label
  const getSubclassLabel = (
    characterClass: string,
    subclass: string,
  ): string => {
    const classKey = characterClass as ClassKeys;
    const subclassOptions = subclassesByClass[classKey];
    if (subclassOptions) {
      const subclassOption = subclassOptions.find(
        (option) => option.value === subclass,
      );
      return subclassOption?.label ?? subclass;
    }
    return subclass;
  };

  // Helper function to get domains for a class
  const getClassDomains = (characterClass: string): string[] => {
    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === characterClass.toLowerCase(),
    );
    if (classData) {
      return [classData.domain_1, classData.domain_2];
    }
    return [];
  };

  // Helper function to get class description
  const getClassDescription = (characterClass: string): string => {
    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === characterClass.toLowerCase(),
    );
    return classData?.description ?? "No description available.";
  };
  return (
    <Card className="border-slate-700 bg-slate-800 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Character Info */}
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">
                {character.name}
              </h1>
              {isOwner && <Crown className="h-6 w-6 text-yellow-500" />}
            </div>

            {character.pronouns && (
              <p className="mb-4 text-lg text-slate-400">
                {character.pronouns}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-400">Level</p>
                <Badge variant="secondary" className="bg-sky-500 text-white">
                  {character.level}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-slate-400">Heritage</p>
                <p className="font-medium text-white capitalize">
                  {character.ancestry}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Class</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 font-medium text-white capitalize hover:text-sky-400 transition-colors">
                      {character.class}
                      <Info className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-slate-800 border-slate-600 text-white">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-lg capitalize">{character.class}</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {getClassDescription(character.class)}
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <p className="text-sm text-slate-400">Subclass</p>
                <p className="font-medium text-white">
                  {getSubclassLabel(character.class, character.subclass)}
                </p>
              </div>
            </div>

            {/* Domain Badges */}
            <div className="mt-4">
              <p className="mb-2 text-sm text-slate-400">Domains</p>
              <div className="flex gap-2">
                {getClassDomains(character.class).map((domain) => (
                  <DomainBadge key={domain} domain={domain} />
                ))}
              </div>
            </div>
          </div>

          {/* Player & Game Info */}
          <div className="flex flex-col gap-4 lg:items-end">
            {/* Player Info */}
            <div className="flex items-center gap-3 rounded-lg border border-slate-600 bg-slate-700 p-3">
              <User className="h-5 w-5 text-slate-400" />
              <div className="flex items-center gap-2">
                {character.user.image && (
                  <Image
                    src={character.user.image}
                    alt={character.user.name ?? ""}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm text-slate-400">Player</p>
                  <p className="font-medium text-white">
                    {character.user.name}
                    {isOwner && " (You)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Game Info */}
            {character.game && (
              <div className="rounded-lg border border-slate-600 bg-slate-700 p-3">
                <p className="text-sm text-slate-400">Current Game</p>
                <Link
                  href={`/game/${character.game.id}`}
                  className="font-medium text-sky-400 hover:text-sky-300"
                >
                  {character.game.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
