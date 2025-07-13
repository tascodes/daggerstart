import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect, notFound } from "next/navigation";
import CharacterLayout from "./CharacterLayout";

interface CharacterLayoutPageProps {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
}

export default async function CharacterLayoutPage({
  params,
  children,
}: CharacterLayoutPageProps) {
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

    return (
      <HydrateClient>
        <CharacterLayout characterId={resolvedParams.id} character={character}>
          {children}
        </CharacterLayout>
      </HydrateClient>
    );
  } catch {
    notFound();
  }
}
