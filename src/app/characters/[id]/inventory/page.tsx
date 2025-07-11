import CharacterInventoryClient from "./CharacterInventoryClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CharacterInventoryPage({ params }: PageProps) {
  return <CharacterInventoryClient characterId={params.id} />;
}
