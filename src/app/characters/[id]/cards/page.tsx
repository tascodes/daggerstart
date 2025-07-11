import { api } from "~/trpc/server";
import CharacterCardsClient from "./CharacterCardsClient";

interface CharacterCardsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CharacterCardsPage({
  params,
  searchParams,
}: CharacterCardsPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  try {
    const character = await api.character.getById({ id: resolvedParams.id });
    const debugMode = resolvedSearchParams.debug === "true";

    return (
      <CharacterCardsClient
        characterId={resolvedParams.id}
        character={character}
        debugMode={debugMode}
      />
    );
  } catch (err) {
    console.error("Error fetching character:", err);
    return null; // Layout will handle the not found case
  }
}
