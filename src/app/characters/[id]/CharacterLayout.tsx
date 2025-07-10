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
import { api } from "~/trpc/react";

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
  game: {
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
  character: initialCharacter,
  children,
}: CharacterLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Use client-side query
  const { data: character } = api.character.getById.useQuery(
    { id: characterId }
  );

  // Use server character as fallback until client query loads
  const currentCharacter = character ?? initialCharacter;

  if (!currentCharacter) {
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

  const isOwner = currentCharacter.user.id === session?.user.id;

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
              currentCharacter.game ? `/campaigns/${currentCharacter.game.id}` : "/characters"
            }
          >
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentCharacter.game ? "Back to Campaign" : "Back to Characters"}
            </Button>
          </Link>

          {/* Level Up Button */}
          {currentCharacter.level < 10 && (
            <LevelUpDrawer
              characterId={currentCharacter.id}
              currentLevel={currentCharacter.level}
              characterName={currentCharacter.name}
              isOwner={isOwner}
            />
          )}
        </div>

        {/* Character Header */}
        <div className="mb-8">
          <CharacterHeader character={currentCharacter} isOwner={isOwner} />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <CharacterTabs characterId={characterId} activeTab={getActiveTab()} />
        </div>

        {/* Page Content */}
        {children}

        {/* Floating Dice Rolls */}
        <FloatingDiceRolls gameId={currentCharacter.game?.id} />
      </div>
    </div>
  );
}
