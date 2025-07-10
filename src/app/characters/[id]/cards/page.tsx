import { api } from "~/trpc/server";
import CharacterCardsClient from "./CharacterCardsClient";

interface CharacterCardsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CharacterCardsPage({
  params,
}: CharacterCardsPageProps) {
  const resolvedParams = await params;

  try {
    const character = await api.character.getById({ id: resolvedParams.id });

    return (
      <CharacterCardsClient
        characterId={resolvedParams.id}
        character={character}
      />
    );
  } catch (err) {
    console.error("Error fetching character:", err);
    return null; // Layout will handle the not found case
  }
}
