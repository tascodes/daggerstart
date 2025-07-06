"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
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
import { api } from "~/trpc/react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const { data: characters, isLoading, refetch } = api.character.getByUserId.useQuery(
    undefined,
    { enabled: !!session }
  );

  const deleteCharacter = api.character.delete.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleDeleteCharacter = (characterId: string) => {
    deleteCharacter.mutate({ id: characterId });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">My Characters</h1>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-slate-300">
                  Welcome, {session.user?.name}
                </span>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={() => signIn("discord")}
                className="bg-sky-500 text-white hover:bg-sky-600"
              >
                Sign In with Discord
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {!session ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Welcome to Character Creator
            </h2>
            <p className="text-slate-400 mb-8">
              Sign in to create and manage your characters.
            </p>
            <Button
              onClick={() => signIn("discord")}
              className="bg-sky-500 text-white hover:bg-sky-600"
            >
              Get Started
            </Button>
          </div>
        ) : (
          <>
            {/* Action Buttons */}
            <div className="mb-8 flex items-center gap-4">
              <Link href="/pc/new">
                <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                  Create New Character
                </Button>
              </Link>
              <Link href="/game">
                <Button
                  variant="outline"
                  className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                >
                  View Games
                </Button>
              </Link>
            </div>

            {/* Characters Grid */}
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-white">Loading your characters...</div>
              </div>
            ) : characters?.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-white mb-4">
                  No characters yet
                </h3>
                <p className="text-slate-400 mb-8">
                  Create your first character to get started on your adventure!
                </p>
                <Link href="/pc/new">
                  <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                    Create Your First Character
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {characters?.map((character) => (
                  <div
                    key={character.id}
                    className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {character.name}
                        </h3>
                        {character.pronouns && (
                          <p className="text-sm text-slate-400">
                            {character.pronouns}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded">
                          Level {character.level}
                        </span>
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
                                Delete Character
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Are you sure you want to delete &quot;{character.name}&quot;? This
                                action cannot be undone and will remove the character from
                                any games they&apos;re currently in.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCharacter(character.id)}
                                disabled={deleteCharacter.isPending}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                {deleteCharacter.isPending ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Class:</span>
                        <span className="text-white capitalize">
                          {character.class}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subclass:</span>
                        <span className="text-white capitalize">
                          {character.subclass.replace(/-/g, " ")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Ancestry:</span>
                        <span className="text-white capitalize">
                          {character.ancestry}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Community:</span>
                        <span className="text-white capitalize">
                          {character.community}
                        </span>
                      </div>
                    </div>

                    {(character.experience1 ?? character.experience2) && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">
                          Experiences:
                        </h4>
                        <div className="space-y-1">
                          {character.experience1 && (
                            <p className="text-xs text-slate-400">
                              • {character.experience1}
                            </p>
                          )}
                          {character.experience2 && (
                            <p className="text-xs text-slate-400">
                              • {character.experience2}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Created {new Date(character.createdAt).toLocaleDateString()}
                      </div>
                      <Link href={`/character/${character.id}`}>
                        <Button 
                          size="sm" 
                          className="bg-sky-500 text-white hover:bg-sky-600"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
