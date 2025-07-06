"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import Link from "next/link";
import { Trash2, Users, Crown } from "lucide-react";

export default function GameListClient() {
  const { data: session } = useSession();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [gameName, setGameName] = useState("");
  const [gameDescription, setGameDescription] = useState("");

  const { data: games, refetch } = api.game.getUserGames.useQuery();

  const createGame = api.game.create.useMutation({
    onSuccess: () => {
      setCreateDialogOpen(false);
      setGameName("");
      setGameDescription("");
      void refetch();
    },
  });

  const deleteGame = api.game.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleCreateGame = () => {
    if (!gameName.trim()) return;
    
    createGame.mutate({
      name: gameName.trim(),
      description: gameDescription.trim() || undefined,
    });
  };

  const handleDeleteGame = (gameId: string) => {
    deleteGame.mutate({ id: gameId });
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Games</h1>
            <p className="text-slate-400">
              Games you&apos;re running or participating in
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="outline"
                className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
              >
                Back to Characters
              </Button>
            </Link>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                  Create New Game
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Game</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Create a new game session. You&apos;ll be the Game Master.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Game Name
                    </Label>
                    <Input
                      id="name"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      placeholder="Enter game name"
                      className="border-slate-600 bg-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="description"
                      value={gameDescription}
                      onChange={(e) => setGameDescription(e.target.value)}
                      placeholder="Describe your game session"
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
                    onClick={handleCreateGame}
                    disabled={!gameName.trim() || createGame.isPending}
                    className="bg-sky-500 text-white hover:bg-sky-600"
                  >
                    {createGame.isPending ? "Creating..." : "Create Game"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Games List */}
        {games?.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-white mb-4">
              No games yet
            </h3>
            <p className="text-slate-400 mb-8">
              Create your first game or ask a Game Master to invite you!
            </p>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                  Create Your First Game
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games?.map((game) => {
              const isGameMaster = game.gameMaster.id === session?.user.id;
              const userCharacter = game.characters.find(
                (char) => char.user.id === session?.user.id
              );

              return (
                <div
                  key={game.id}
                  className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {game.name}
                        </h3>
                        {isGameMaster && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      {game.description && (
                        <p className="text-sm text-slate-400 mb-3">
                          {game.description}
                        </p>
                      )}
                    </div>
                    {isGameMaster && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-950"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-slate-800 border-slate-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Delete Game
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              Are you sure you want to delete &quot;{game.name}&quot;? This
                              action cannot be undone and will remove all
                              characters from the game.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteGame(game.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Game Master:</span>
                      <span className="text-white text-sm">
                        {game.gameMaster.name}
                        {isGameMaster && " (You)"}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Characters:
                      </span>
                      <span className="text-white text-sm">
                        {game._count.characters}
                      </span>
                    </div>

                    {userCharacter && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Your Character:</span>
                        <span className="text-sky-400 text-sm font-medium">
                          {userCharacter.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="text-xs text-slate-500">
                      Created {new Date(game.createdAt).toLocaleDateString()}
                    </div>
                    <Link href={`/game/${game.id}`}>
                      <Button
                        size="sm"
                        className="bg-sky-500 text-white hover:bg-sky-600"
                      >
                        View Game
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