import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { redirect, notFound } from "next/navigation";
import CharacterDetailClient from "./CharacterDetailClient";

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CharacterDetailPage({ params }: CharacterDetailPageProps) {
  const session = await auth();
  const resolvedParams = await params;
  
  if (!session) {
    redirect("/");
  }

  try {
    // Prefetch character data
    void api.character.getById.prefetch({ id: resolvedParams.id });
    
    // Check if character exists by trying to fetch it
    const character = await api.character.getById({ id: resolvedParams.id });
    
    if (!character) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <HydrateClient>
      <CharacterDetailClient characterId={resolvedParams.id} />
    </HydrateClient>
  );
}