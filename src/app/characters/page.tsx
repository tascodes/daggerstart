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
  const {
    data: characters,
    isLoading,
    refetch,
  } = api.character.getByUserId.useQuery(undefined, { enabled: !!session });

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
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
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
          <div className="py-16 text-center">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Welcome to Character Creator
            </h2>
            <p className="mb-8 text-slate-400">
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
            <div className="mb-8">
              <Link href="/characters/create">
                <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                  Create New Character
                </Button>
              </Link>
            </div>

            {/* Characters Grid */}
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="text-white">Loading your characters...</div>
              </div>
            ) : characters?.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="mb-4 text-xl font-semibold text-white">
                  No characters yet
                </h3>
                <p className="mb-8 text-slate-400">
                  Create your first character to get started on your adventure!
                </p>
                <Link href="/characters/create">
                  <Button className="bg-sky-500 text-white hover:bg-yellow-600">
                    Create Your First Character
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {characters?.map((character) => (
                  <div
                    key={character.id}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg transition-colors hover:border-slate-600"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="mb-1 text-xl font-bold text-white">
                          {character.name}
                        </h3>
                        {character.pronouns && (
                          <p className="text-sm text-slate-400">
                            {character.pronouns}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-sky-500 px-2 py-1 text-xs text-white">
                          Level {character.level}
                        </span>
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
                                Delete Character
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Are you sure you want to delete &quot;
                                {character.name}&quot;? This action cannot be
                                undone and will remove the character from any
                                games they&apos;re currently in.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteCharacter(character.id)
                                }
                                disabled={deleteCharacter.isPending}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                {deleteCharacter.isPending
                                  ? "Deleting..."
                                  : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
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

                    {character.experiences &&
                      character.experiences.length > 0 && (
                        <div className="mb-4">
                          <h4 className="mb-2 text-sm font-semibold text-slate-300">
                            Experiences:
                          </h4>
                          <div className="space-y-1">
                            {character.experiences.map((exp) => (
                              <p
                                key={exp.id}
                                className="text-xs text-slate-400"
                              >
                                • {exp.name} +{exp.bonus}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Created{" "}
                        {new Date(character.createdAt).toLocaleDateString()}
                      </div>
                      <Link href={`/characters/${character.id}`}>
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
