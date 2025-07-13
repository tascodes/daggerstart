"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import Link from "next/link";
import { Crown, Users, UserMinus, UserPlus } from "lucide-react";
import Image from "next/image";
import DiceRoller from "@/components/DiceRoller";
import DiceRollFeed from "@/components/DiceRollFeed";
import FloatingDiceRolls from "@/components/FloatingDiceRolls";
import FearBar from "@/components/FearBar";

interface CampaignDetailClientProps {
  campaignId: string;
}

export default function CampaignDetailClient({
  campaignId,
}: CampaignDetailClientProps) {
  const { data: session } = useSession();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");

  const { data: campaign, refetch } = api.game.getById.useQuery({
    id: campaignId,
  });

  const { data: availableData } = api.game.getAvailableCharacters.useQuery({
    gameId: campaignId,
  });

  // Get Fear data for campaign master
  const { data: fearCount } = api.game.getFear.useQuery(
    { gameId: campaignId },
    { enabled: !!session?.user.id && !!campaignId },
  );

  const utils = api.useUtils();
  const updateFear = api.game.updateFear.useMutation({
    onMutate: async (variables) => {
      await utils.game.getFear.cancel({ gameId: campaignId });
      const previousFear = utils.game.getFear.getData({ gameId: campaignId });
      utils.game.getFear.setData({ gameId: campaignId }, variables.fearCount);
      return { previousFear };
    },
    onError: (error, variables, context) => {
      utils.game.getFear.setData({ gameId: campaignId }, context?.previousFear);
    },
    onSettled: () => {
      void utils.game.getFear.invalidate({ gameId: campaignId });
    },
  });

  // Subscribe to Fear updates
  api.game.onFearUpdate.useSubscription(
    { gameId: campaignId },
    {
      enabled: !!session?.user.id && !!campaignId,
      onData: () => {
        // Trigger a refetch when Fear updates occur
        void utils.game.getFear.invalidate({ gameId: campaignId });
      },
    },
  );

  const addCharacterToGame = api.game.addCharacterToGame.useMutation({
    onSuccess: () => {
      setJoinDialogOpen(false);
      setSelectedCharacterId("");
      void refetch();
    },
  });

  const removeCharacterFromGame = api.game.removeCharacterFromGame.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleJoinGame = () => {
    if (!selectedCharacterId) return;

    addCharacterToGame.mutate({
      gameId: campaignId,
      characterId: selectedCharacterId,
    });
  };

  const handleLeaveGame = (characterId: string) => {
    removeCharacterFromGame.mutate({ characterId });
  };

  const handleFearChange = (newFear: number) => {
    updateFear.mutate({
      gameId: campaignId,
      fearCount: newFear,
    });
  };

  if (!campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">Game not found</h1>
          <Link href="/campaigns">
            <Button className="bg-sky-500 text-white hover:bg-sky-600">
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isGameMaster = campaign.gameMaster.id === session?.user.id;
  const canJoinGame =
    availableData?.canAddCharacter && availableData.characters.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-4xl font-bold text-white">{campaign.name}</h1>
              {isGameMaster && <Crown className="h-8 w-8 text-yellow-500" />}
            </div>
            {campaign.description && (
              <p className="text-lg text-slate-400">{campaign.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/campaigns">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
              >
                Back to Campaigns
              </Button>
            </Link>
            {canJoinGame && (
              <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isGameMaster ? "Add Character" : "Join Game"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-slate-700 bg-slate-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {isGameMaster ? "Add Character" : "Join Game"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                      {isGameMaster
                        ? "Select a character to add to your campaign."
                        : "Select a character to add to this campaign."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="character" className="text-white">
                        Choose Character
                      </Label>
                      <Select
                        value={selectedCharacterId}
                        onValueChange={setSelectedCharacterId}
                      >
                        <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                          <SelectValue placeholder="Select a character" />
                        </SelectTrigger>
                        <SelectContent className="border-slate-600 bg-slate-700">
                          {availableData?.characters.map((character) => (
                            <SelectItem
                              key={character.id}
                              value={character.id}
                              className="text-white focus:bg-slate-600"
                            >
                              {character.name} - Level {character.level}{" "}
                              {character.class}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setJoinDialogOpen(false)}
                      className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleJoinGame}
                      disabled={
                        !selectedCharacterId || addCharacterToGame.isPending
                      }
                      className="bg-sky-500 text-white hover:bg-sky-600"
                    >
                      {addCharacterToGame.isPending
                        ? isGameMaster
                          ? "Adding..."
                          : "Joining..."
                        : isGameMaster
                          ? "Add Character"
                          : "Join Game"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Game Master Section */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Game Master</h2>
              </div>
              <div className="flex items-center gap-3">
                {campaign.gameMaster.image && (
                  <Image
                    src={campaign.gameMaster.image}
                    alt={campaign.gameMaster.name ?? ""}
                    height={48}
                    width={48}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-white">
                    {campaign.gameMaster.name}
                    {isGameMaster && " (You)"}
                  </p>
                  <p className="text-sm text-slate-400">Game Master</p>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-white">Game Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Users className="h-4 w-4" />
                    Characters:
                  </span>
                  <span className="text-white">
                    {campaign._count.characters}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-white">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Characters Section */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Characters</h2>
                <span className="text-sm text-slate-400">
                  {campaign.characters.length} character(s) in this campaign
                </span>
              </div>

              {campaign.characters.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-slate-400">
                    No characters have joined this campaign yet.
                  </p>
                  {canJoinGame && (
                    <Dialog
                      open={joinDialogOpen}
                      onOpenChange={setJoinDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                          {isGameMaster
                            ? "Add Your First Character!"
                            : "Be the First to Join!"}
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {campaign.characters.map((character) => {
                    const isUserCharacter =
                      character.user.id === session?.user.id;

                    return (
                      <div
                        key={character.id}
                        className={`rounded-lg border bg-slate-700 p-4 ${
                          isUserCharacter
                            ? "border-sky-500"
                            : "border-slate-600"
                        }`}
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <Link
                              href={`/characters/${character.id}`}
                              className="mb-1 text-lg font-bold text-white transition-colors hover:text-sky-400"
                            >
                              {character.name}
                            </Link>
                            {isUserCharacter && (
                              <span className="ml-2 text-sm text-sky-400">
                                (Your Character)
                              </span>
                            )}
                            {character.pronouns && (
                              <p className="text-sm text-slate-400">
                                {character.pronouns}
                              </p>
                            )}
                          </div>
                          <span className="rounded bg-sky-500 px-2 py-1 text-xs text-white">
                            Level {character.level}
                          </span>
                        </div>

                        <div className="mb-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Class:</span>
                            <span className="text-white capitalize">
                              {character.class}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Ancestry:</span>
                            <span className="text-white capitalize">
                              {character.ancestry}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-600 pt-3">
                          <div className="flex items-center gap-2">
                            {character.user.image && (
                              <Image
                                src={character.user.image}
                                alt={character.user.name ?? ""}
                                width={24}
                                height={24}
                                className="h-6 w-6 rounded-full"
                              />
                            )}
                            <span className="text-sm text-slate-400">
                              {character.user.name}
                            </span>
                          </div>
                          {isUserCharacter && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleLeaveGame(character.id)}
                              disabled={removeCharacterFromGame.isPending}
                              className="border-red-600 text-red-400 hover:bg-red-950 hover:text-red-300"
                            >
                              <UserMinus className="mr-1 h-4 w-4" />
                              Leave
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fear Section - Only show to campaign master */}
        {isGameMaster && (
          <div className="mt-8 w-fit rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-white">Fear</h3>
            <FearBar
              value={fearCount ?? 0}
              maxValue={12}
              onValueChange={handleFearChange}
            />
            <p className="mt-2 text-xs text-slate-400">
              Increases when players roll with Fear
            </p>
          </div>
        )}

        {/* Dice Rolling Section */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Dice Roller */}
          <div>
            {session && (
              <DiceRoller
                gameId={campaignId}
                characterId={
                  campaign.characters.find(
                    (char) => char.user.id === session.user.id,
                  )?.id
                }
                characterName={
                  campaign.characters.find(
                    (char) => char.user.id === session.user.id,
                  )?.name
                }
              />
            )}
          </div>

          {/* Dice Roll Feed */}
          <div>
            <DiceRollFeed
              gameId={campaignId}
              isGameMaster={isGameMaster}
              limit={15}
            />
          </div>
        </div>

        {/* Floating Dice Rolls */}
        <FloatingDiceRolls
          gameId={campaignId}
          onFearRoll={
            isGameMaster
              ? () => void utils.game.getFear.invalidate({ gameId: campaignId })
              : undefined
          }
        />
      </div>
    </div>
  );
}
