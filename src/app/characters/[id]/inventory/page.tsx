import CharacterInventoryClient from "./CharacterInventoryClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CharacterInventoryPage({ params }: PageProps) {
  const { id } = await params;
  return <CharacterInventoryClient characterId={id} />;
}
