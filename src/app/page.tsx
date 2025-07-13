import Link from "next/link";
import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 text-6xl font-bold text-white">
          Welcome to Daggerstart
        </h1>
        <p className="mb-12 text-xl text-gray-300">
          Your gateway to epic adventures in Daggerheart. Create characters,
          manage campaigns, and embark on legendary quests.
        </p>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          {!session ? (
            <Link href="/api/auth/signin">
              <Button
                size="lg"
                className="bg-sky-500 text-white hover:bg-sky-600"
              >
                Sign In
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/characters/create">
                <Button
                  size="lg"
                  className="bg-sky-500 text-white hover:bg-sky-600"
                >
                  Create Character
                </Button>
              </Link>
              <Link href="/campaigns">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-slate-900"
                >
                  Create Campaign
                </Button>
              </Link>
            </>
          )}
        </div>

        {session && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <Link
              href="/characters"
              className="group block rounded-lg border border-slate-700 p-8 transition-colors hover:border-sky-500"
            >
              <h2 className="mb-3 text-2xl font-semibold text-white group-hover:text-sky-500">
                My Characters
              </h2>
              <p className="text-gray-400">
                View and manage your existing characters
              </p>
            </Link>

            <Link
              href="/campaigns"
              className="group block rounded-lg border border-slate-700 p-8 transition-colors hover:border-yellow-600"
            >
              <h2 className="mb-3 text-2xl font-semibold text-white group-hover:text-yellow-600">
                My Campaigns
              </h2>
              <p className="text-gray-400">Browse and join active campaigns</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
