import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/server/auth";
import Navigation from "~/components/Navigation";

export const metadata: Metadata = {
  title: "DaggerHeart Character Manager",
  description: "Create and manage your DaggerHeart characters and games",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-slate-900 text-white">
        <TRPCReactProvider>
          <SessionProvider session={session}>
            <Navigation />
            <main>{children}</main>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
