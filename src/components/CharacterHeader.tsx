"use client";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { User, Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export default function CharacterHeader({ character, isOwner }: CharacterHeaderProps) {
  return (
    <Card className="border-slate-700 bg-slate-800 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Character Info */}
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">{character.name}</h1>
              {isOwner && <Crown className="h-6 w-6 text-yellow-500" />}
            </div>
            
            {character.pronouns && (
              <p className="mb-4 text-lg text-slate-400">{character.pronouns}</p>
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
                <p className="font-medium text-white capitalize">{character.ancestry}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-400">Class</p>
                <p className="font-medium text-white capitalize">{character.class}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-400">Subclass</p>
                <p className="font-medium text-white capitalize">{character.subclass}</p>
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