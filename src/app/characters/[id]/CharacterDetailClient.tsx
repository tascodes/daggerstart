"use client";

import { useSession } from "next-auth/react";
import CharacterExperiences from "~/components/CharacterExperiences";
import CharacterTraits from "~/components/CharacterTraits";
import HealthSection from "~/components/HealthSection";
import DefenseSection from "~/components/DefenseSection";
import EquippedWeaponSection from "~/components/EquippedWeaponSection";
import ClassFeatures from "~/components/ClassFeatures";
import FearBar from "~/components/FearBar";
import FloatingHopePanel from "~/components/FloatingHopePanel";
import FloatingFearPanel from "~/components/FloatingFearPanel";
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

  // Subscribe to Character updates
  api.game.onCharacterUpdate.useSubscription(
    { gameId: character?.gameId ?? "" },
    {
      enabled: !!character?.gameId && !!session,
      onData: (data) => {
        // Trigger a refetch when character data updates occur
        if (data.characterId === character?.id) {
          void utils.character.getById.invalidate({ id: character.id });
        }
      },
    },
  );

  // Hope mutation with optimistic updates
  const updateHope = api.character.updateHealthStat.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.character.getById.cancel({ id: character?.id ?? "" });

      // Snapshot the previous value
      const previousCharacter = utils.character.getById.getData({
        id: character?.id ?? "",
      });

      // Optimistically update to the new value
      if (previousCharacter && variables.field === "hope") {
        utils.character.getById.setData(
          { id: character?.id ?? "" },
          {
            ...previousCharacter,
            hope: variables.value,
          },
        );
      }

      // Return a context object with the snapshotted value
      return { previousCharacter };
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to rollback
      if (context?.previousCharacter) {
        utils.character.getById.setData(
          { id: character?.id ?? "" },
          context.previousCharacter,
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      void utils.character.getById.invalidate({ id: character?.id ?? "" });
    },
  });

  if (!character) {
    return null; // Layout will handle the not found case
  }

  const isOwner = character.user.id === session?.user.id;

  return (
    <>
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

        {/* Equipped Weapon Section */}
        {(character.equippedPrimaryWeapon ||
          character.equippedSecondaryWeapon) && (
          <div className="mb-8">
            <EquippedWeaponSection character={character} />
          </div>
        )}

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
            </div>
          </div>
        </div>

        {/* Class Features Section */}
        <div className="mt-8">
          <ClassFeatures character={character} />
        </div>
      </div>

      {/* Floating Panels */}
      <FloatingHopePanel
        value={character.hope}
        maxValue={6}
        onValueChange={(newValue) => {
          if (isOwner) {
            updateHope.mutate({
              id: character.id,
              field: "hope",
              value: newValue,
            });
          }
        }}
        disabled={!isOwner}
      />

      {character.gameId && fearCount !== undefined && (
        <FloatingFearPanel value={fearCount} maxValue={12} />
      )}
    </>
  );
}
