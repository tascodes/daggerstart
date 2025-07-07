"use client";

// import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CharacterTabs from "~/components/CharacterTabs";
import FloatingDiceRolls from "~/components/FloatingDiceRolls";

interface Character {
  id: string;
  name: string;
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
  characterId,
  character 
}: CharacterCardsClientProps) {
  // const { data: session } = useSession();

  if (!character) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Character not found</h1>
          <p className="text-slate-400">This character doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        </div>
      </div>
    );
  }

  // const isOwner = character.user.id === session?.user.id;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <Link href={character.game ? `/game/${character.game.id}` : "/"}>
            <Button
              variant="outline"
              className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {character.game ? "Back to Game" : "Back to Home"}
            </Button>
          </Link>
        </div>

        {/* Character Name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">{character.name}</h1>
          <p className="text-slate-400">Character Cards</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <CharacterTabs characterId={characterId} activeTab="cards" />
        </div>

        {/* Cards Content */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-lg">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Character Cards</h2>
            <p className="text-slate-400">
              Card management interface coming soon...
            </p>
          </div>
        </div>

        {/* Floating Dice Rolls */}
        <FloatingDiceRolls gameId={character.game?.id} />
      </div>
    </div>
  );
}