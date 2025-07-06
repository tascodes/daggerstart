"use client";

import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CharacterHeader from "~/components/CharacterHeader";
import CharacterExperiences from "~/components/CharacterExperiences";
import { api } from "~/trpc/react";

interface CharacterDetailClientProps {
  characterId: string;
}

export default function CharacterDetailClient({ 
  characterId 
}: CharacterDetailClientProps) {
  const { data: session } = useSession();
  const { data: character } = api.character.getById.useQuery({ id: characterId });

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

  const isOwner = character.user.id === session?.user.id;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-4xl px-4">
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

        {/* Character Header */}
        <div className="mb-8">
          <CharacterHeader character={character} isOwner={isOwner} />
        </div>

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
            <h2 className="mb-4 text-xl font-bold text-white">Additional Details</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">Community</p>
                <p className="font-medium text-white capitalize">{character.community}</p>
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
    </div>
  );
}