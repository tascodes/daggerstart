import "@/styles/globals.css";

import { type Metadata } from "next";
import { Archivo, Geist_Mono } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/server/auth";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Daggerheart Character Manager",
  description: "Create and manage your Daggerheart characters and campaigns",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="en" className={`${archivo.variable} ${geistMono.variable}`}>
      <body className="bg-slate-900 font-sans text-white">
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
