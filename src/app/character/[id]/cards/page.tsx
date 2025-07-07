import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";
import CharacterCardsClient from "./CharacterCardsClient";

interface CharacterCardsPageProps {
  params: { id: string };
}

export default async function CharacterCardsPage({ params }: CharacterCardsPageProps) {
  const session = await auth();
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  try {
    const character = await api.character.getById({ id: params.id });
    
    return (
      <CharacterCardsClient 
        characterId={params.id}
        character={character}
      />
    );
  } catch (err) {
    console.error("Error fetching character:", err);
    redirect("/");
  }
}