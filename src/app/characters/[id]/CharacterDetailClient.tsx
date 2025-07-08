"use client";

import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CharacterHeader from "~/components/CharacterHeader";
import CharacterExperiences from "~/components/CharacterExperiences";
import CharacterAbilities from "~/components/CharacterAbilities";
import HealthSection from "~/components/HealthSection";
import DefenseSection from "~/components/DefenseSection";
import GoldSection from "~/components/GoldSection";
import CharacterTabs from "~/components/CharacterTabs";
import FloatingDiceRolls from "~/components/FloatingDiceRolls";
import FearBar from "~/components/FearBar";
import { api } from "~/trpc/react";

interface CharacterDetailClientProps {
  characterId: string;
}

export default function CharacterDetailClient({
  characterId,
}: CharacterDetailClientProps) {
  const { data: session } = useSession();
  const { data: character, refetch } = api.character.getById.useQuery({
    id: characterId,
  });

  // Get Fear data if character is in a game
  const { data: fearCount } = api.game.getFear.useQuery(
    { gameId: character?.gameId! },
    { enabled: !!character?.gameId },
  );

  const utils = api.useUtils();

  // Subscribe to Fear updates
  api.game.onFearUpdate.useSubscription(
    { gameId: character?.gameId! },
    {
      enabled: !!character?.gameId && !!session,
      onData: () => {
        // Trigger a refetch when Fear updates occur
        void utils.game.getFear.invalidate({ gameId: character?.gameId! });
      },
    },
  );

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

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center gap-4">
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
        </div>

        {/* Character Header */}
        <div className="mb-8">
          <CharacterHeader character={character} isOwner={isOwner} />
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <CharacterTabs characterId={characterId} activeTab="details" />
        </div>

        {/* Abilities Section */}
        <div className="mb-8">
          <CharacterAbilities
            character={character}
            isOwner={isOwner}
            game={character.game}
            onUpdate={() => void refetch()}
          />
        </div>

        {/* Health Section */}
        <div className="mb-8">
          <HealthSection
            character={character}
            isOwner={isOwner}
            onUpdate={() => void refetch()}
          />
        </div>

        {/* Defense Section */}
        <div className="mb-8">
          <DefenseSection
            character={character}
            isOwner={isOwner}
            onUpdate={() => void refetch()}
          />
        </div>

        {/* Gold Section */}
        <div className="mb-8">
          <GoldSection
            character={character}
            isOwner={isOwner}
            onUpdate={() => void refetch()}
          />
        </div>

        {/* Fear Section - Show GM's Fear if character is in a game */}
        {character.gameId && (
          <div className="mb-8 w-fit rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-white">Fear</h3>
            <FearBar
              value={fearCount ?? 0}
              maxValue={12}
              onValueChange={() => {}} // Read-only, no edit functionality
              readonly={true}
            />
          </div>
        )}

        {/* Character Details Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Experiences Section */}
          <div>
            <CharacterExperiences
              experience1={character.experience1}
              experience2={character.experience2}
            />
          </div>

          {/* Additional Info Section */}
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-white">
              Additional Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Community</p>
                <p className="font-medium text-white capitalize">
                  {character.community}
                </p>
              </div>

              {/* Future sections can be added here */}
              <div className="rounded-lg border border-slate-600 bg-slate-700 p-4">
                <p className="text-center text-slate-400">
                  More character details coming soon...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Dice Rolls */}
        <FloatingDiceRolls gameId={character.game?.id} />
      </div>
    </div>
  );
}
