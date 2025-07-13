"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import Link from "next/link";
import { Trash2, Users, Crown } from "lucide-react";

export default function CampaignListClient() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");

  // Check for create query parameter on mount
  useEffect(() => {
    const shouldOpenCreate = searchParams.get("create") === "true";
    if (shouldOpenCreate) {
      setCreateDialogOpen(true);
    }
  }, [searchParams]);

  const { data: campaigns, refetch } = api.game.getUserGames.useQuery();

  const createCampaign = api.game.create.useMutation({
    onSuccess: () => {
      setCreateDialogOpen(false);
      setCampaignName("");
      setCampaignDescription("");
      void refetch();
    },
  });

  const deleteCampaign = api.game.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleCreateCampaign = () => {
    if (!campaignName.trim()) return;

    createCampaign.mutate({
      name: campaignName.trim(),
      description: campaignDescription.trim() || undefined,
    });
  };

  const handleDeleteCampaign = (campaignId: string) => {
    deleteCampaign.mutate({ id: campaignId });
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">My Campaigns</h1>
            <p className="text-slate-400">
              Campaigns you&apos;re running or participating in
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                  Create New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-700 bg-slate-800">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    Create New Campaign
                  </DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Create a new campaign session. You&apos;ll be the Campaign
                    Master.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Campaign Name
                    </Label>
                    <Input
                      id="name"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Enter campaign name"
                      className="border-slate-600 bg-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      value={campaignDescription}
                      onChange={(e) => setCampaignDescription(e.target.value)}
                      placeholder="Describe your campaign session"
                      className="border-slate-600 bg-slate-700 text-white"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCreateCampaign}
                    disabled={!campaignName.trim() || createCampaign.isPending}
                    className="bg-sky-500 text-white hover:bg-sky-600"
                  >
                    {createCampaign.isPending
                      ? "Creating..."
                      : "Create Campaign"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Campaigns List */}
        {campaigns?.length === 0 ? (
          <div className="py-16 text-center">
            <h3 className="mb-4 text-xl font-semibold text-white">
              No campaigns yet
            </h3>
            <p className="mb-8 text-slate-400">
              Create your first campaign or ask a Campaign Master to invite you!
            </p>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                  Create Your First Campaign
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns?.map((campaign) => {
              const isCampaignMaster =
                campaign.gameMaster.id === session?.user.id;
              const userCharacter = campaign.characters.find(
                (char) => char.user.id === session?.user.id,
              );

              return (
                <div
                  key={campaign.id}
                  className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition-colors hover:border-slate-600"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">
                          {campaign.name}
                        </h3>
                        {isCampaignMaster && (
                          <Crown className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      {campaign.description && (
                        <p className="mb-3 text-sm text-slate-400">
                          {campaign.description}
                        </p>
                      )}
                    </div>
                    {isCampaignMaster && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:bg-red-950 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-slate-700 bg-slate-800">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Delete Campaign
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Are you sure you want to delete &quot;
                              {campaign.name}
                              &quot;? This action cannot be undone and will
                              remove all characters from the campaign.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">
                        Campaign Master:
                      </span>
                      <span className="text-sm text-white">
                        {campaign.gameMaster.name}
                        {isCampaignMaster && " (You)"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-slate-400">
                        <Users className="h-4 w-4" />
                        Characters:
                      </span>
                      <span className="text-sm text-white">
                        {campaign._count.characters}
                      </span>
                    </div>

                    {userCharacter && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                          Your Character:
                        </span>
                        <span className="text-sm font-medium text-sky-400">
                          {userCharacter.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-700 pt-4">
                    <div className="text-xs text-slate-500">
                      Created{" "}
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </div>
                    <Link href={`/campaigns/${campaign.id}`}>
                      <Button
                        size="sm"
                        className="bg-sky-500 text-white hover:bg-sky-600"
                      >
                        View Campaign
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
