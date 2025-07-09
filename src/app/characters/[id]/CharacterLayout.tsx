"use client";

import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CharacterHeader from "~/components/CharacterHeader";
import CharacterTabs from "~/components/CharacterTabs";
import FloatingDiceRolls from "~/components/FloatingDiceRolls";
import LevelUpDrawer from "~/components/LevelUpDrawer";
import { usePathname } from "next/navigation";

interface Character {
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
}

interface CharacterLayoutProps {
  characterId: string;
  character: Character;
  children: React.ReactNode;
}

export default function CharacterLayout({
  characterId,
  character,
  children,
}: CharacterLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!character) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Character not found
          </h1>
          <p className="text-slate-400">
            This character doesn&apos;t exist or you don&apos;t have permission
            to view it.
          </p>
        </div>
      </div>
    );
  }

  const isOwner = character.user.id === session?.user.id;

  // Determine active tab based on pathname
  const getActiveTab = () => {
    if (pathname.endsWith("/cards")) {
      return "cards";
    }
    return "details";
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href={
              character.game ? `/games/${character.game.id}` : "/characters"
            }
          >
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {character.game ? "Back to Game" : "Back to Characters"}
            </Button>
          </Link>
          
          {/* Level Up Button */}
          {character.level < 10 && (
            <LevelUpDrawer
              currentLevel={character.level}
              characterName={character.name}
              isOwner={isOwner}
            />
          )}
        </div>

        {/* Character Header */}
        <div className="mb-8">
          <CharacterHeader character={character} isOwner={isOwner} />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <CharacterTabs characterId={characterId} activeTab={getActiveTab()} />
        </div>

        {/* Page Content */}
        {children}

        {/* Floating Dice Rolls */}
        <FloatingDiceRolls gameId={character.game?.id} />
      </div>
    </div>
  );
}