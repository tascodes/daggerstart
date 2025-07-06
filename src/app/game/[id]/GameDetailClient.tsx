"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Crown, Users, UserMinus, UserPlus } from "lucide-react";

interface GameDetailClientProps {
  gameId: string;
}

export default function GameDetailClient({ gameId }: GameDetailClientProps) {
  const { data: session } = useSession();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");

  const { data: game, refetch } = api.game.getById.useQuery({ id: gameId });

  const { data: availableData } = api.game.getAvailableCharacters.useQuery(
    { gameId },
    { enabled: joinDialogOpen }
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
      gameId,
      characterId: selectedCharacterId,
    });
  };

  const handleLeaveGame = (characterId: string) => {
    removeCharacterFromGame.mutate({ characterId });
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Game not found</h1>
          <Link href="/game">
            <Button className="bg-sky-500 text-white hover:bg-sky-600">
              Back to Games
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isGameMaster = game.gameMaster.id === session?.user.id;
  const canJoinGame = availableData?.canAddCharacter && availableData.characters.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-white">{game.name}</h1>
              {isGameMaster && <Crown className="w-8 h-8 text-yellow-500" />}
            </div>
            {game.description && (
              <p className="text-slate-400 text-lg">{game.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/game">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
              >
                Back to Games
              </Button>
            </Link>
            {canJoinGame && (
              <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Join Game
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">Join Game</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Select a character to add to this game.
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
                      disabled={!selectedCharacterId || addCharacterToGame.isPending}
                      className="bg-sky-500 text-white hover:bg-sky-600"
                    >
                      {addCharacterToGame.isPending ? "Joining..." : "Join Game"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Master Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Game Master</h2>
              </div>
              <div className="flex items-center gap-3">
                {game.gameMaster.image && (
                  <img
                    src={game.gameMaster.image}
                    alt={game.gameMaster.name ?? ""}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="text-white font-medium">
                    {game.gameMaster.name}
                    {isGameMaster && " (You)"}
                  </p>
                  <p className="text-slate-400 text-sm">Game Master</p>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Game Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Characters:
                  </span>
                  <span className="text-white">{game._count.characters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="text-white">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Characters Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Characters</h2>
                <span className="text-slate-400 text-sm">
                  {game.characters.length} character(s) in this game
                </span>
              </div>

              {game.characters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">
                    No characters have joined this game yet.
                  </p>
                  {canJoinGame && (
                    <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                          Be the First to Join!
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.characters.map((character) => {
                    const isUserCharacter = character.user.id === session?.user.id;
                    
                    return (
                      <div
                        key={character.id}
                        className={`bg-slate-700 rounded-lg p-4 border ${
                          isUserCharacter
                            ? "border-sky-500"
                            : "border-slate-600"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">
                              {character.name}
                              {isUserCharacter && (
                                <span className="text-sky-400 text-sm ml-2">
                                  (Your Character)
                                </span>
                              )}
                            </h3>
                            {character.pronouns && (
                              <p className="text-sm text-slate-400">
                                {character.pronouns}
                              </p>
                            )}
                          </div>
                          <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded">
                            Level {character.level}
                          </span>
                        </div>

                        <div className="space-y-1 mb-3">
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

                        <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                          <div className="flex items-center gap-2">
                            {character.user.image && (
                              <img
                                src={character.user.image}
                                alt={character.user.name ?? ""}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className="text-slate-400 text-sm">
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
                              <UserMinus className="w-4 h-4 mr-1" />
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
      </div>
    </div>
  );
}