import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { redirect } from "next/navigation";
import CampaignListClient from "./CampaignListClient";

export default async function CampaignListPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  // Prefetch campaigns data
  void api.game.getUserGames.prefetch();

  return (
    <HydrateClient>
      <CampaignListClient />
    </HydrateClient>
  );
}
