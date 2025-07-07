import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { redirect, notFound } from "next/navigation";
import GameDetailClient from "./GameDetailClient";

interface GameDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const session = await auth();
  const resolvedParams = await params;

  if (!session) {
    redirect("/");
  }

  try {
    // Prefetch game data
    void api.game.getById.prefetch({ id: resolvedParams.id });

    // Check if game exists by trying to fetch it
    const game = await api.game.getById({ id: resolvedParams.id });

    if (!game) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <HydrateClient>
      <GameDetailClient gameId={resolvedParams.id} />
    </HydrateClient>
  );
}
