import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import GameListClient from "./GameListClient";

export default async function GameListPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Prefetch games data
  void api.game.getUserGames.prefetch();

  return (
    <HydrateClient>
      <GameListClient />
    </HydrateClient>
  );
}