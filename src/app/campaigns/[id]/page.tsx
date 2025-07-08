import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { redirect, notFound } from "next/navigation";
import CampaignDetailClient from "./CampaignDetailClient";

interface CampaignDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const session = await auth();
  const resolvedParams = await params;

  if (!session) {
    redirect("/");
  }

  try {
    // Prefetch campaign data
    void api.game.getById.prefetch({ id: resolvedParams.id });

    // Check if campaign exists by trying to fetch it
    const campaign = await api.game.getById({ id: resolvedParams.id });

    if (!campaign) {
      notFound();
    }
  } catch {
    notFound();
  }

  return (
    <HydrateClient>
      <CampaignDetailClient campaignId={resolvedParams.id} />
    </HydrateClient>
  );
}
