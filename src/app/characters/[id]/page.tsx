import CharacterDetailClient from "./CharacterDetailClient";

interface CharacterDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const resolvedParams = await params;

  return <CharacterDetailClient characterId={resolvedParams.id} />;
}
