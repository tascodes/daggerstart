"use client";

import { useSession } from "next-auth/react";
import CharacterExperiences from "~/components/CharacterExperiences";
import CharacterTraits from "~/components/CharacterTraits";
import HealthSection from "~/components/HealthSection";
import DefenseSection from "~/components/DefenseSection";
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
    { gameId: character?.gameId ?? "" },
    { enabled: !!character?.gameId },
  );

  const utils = api.useUtils();

  // Subscribe to Fear updates
  api.game.onFearUpdate.useSubscription(
    { gameId: character?.gameId ?? "" },
    {
      enabled: !!character?.gameId && !!session,
      onData: () => {
        // Trigger a refetch when Fear updates occur
        void utils.game.getFear.invalidate({ gameId: character?.gameId ?? "" });
      },
    },
  );

  if (!character) {
    return null; // Layout will handle the not found case
  }

  const isOwner = character.user.id === session?.user.id;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Traits Section */}
      <div className="mb-8">
        <CharacterTraits
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
            experiences={character.experiences}
            isOwner={isOwner}
            onUpdate={() => void refetch()}
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
    </div>
  );
}
