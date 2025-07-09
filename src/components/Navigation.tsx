"use client";

import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

const Navigation = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full border-b border-slate-700 bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-slate-900 text-white hover:bg-slate-800 hover:text-sky-500 data-[active]:bg-slate-800 data-[state=open]:bg-slate-800">
                Campaigns
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 border border-slate-700 bg-slate-800 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b from-slate-700/50 to-slate-700 p-6 text-white no-underline outline-none select-none hover:bg-slate-600 focus:shadow-md"
                        href="/campaigns"
                      >
                        <div className="mt-4 mb-2 text-lg font-medium text-white">
                          My Campaigns
                        </div>
                        <p className="text-sm leading-tight text-slate-300">
                          Manage and join Daggerheart campaigns
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem
                    href="/campaigns?create=true"
                    title="Create Campaign"
                  >
                    Start a new Daggerheart campaign
                  </ListItem>
                  <ListItem href="/campaigns/join" title="Join Campaign">
                    Join an existing campaign with an invite code
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-slate-900 text-white hover:bg-slate-800 hover:text-sky-500 data-[active]:bg-slate-800 data-[state=open]:bg-slate-800">
                Characters
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 border border-slate-700 bg-slate-800 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem href="/characters" title="My Characters">
                    View and manage your character roster
                  </ListItem>
                  <ListItem href="/characters/create" title="Create Character">
                    Build a new Daggerheart character
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sign In/Out Section */}
        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full p-0 hover:bg-slate-800"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image ?? undefined}
                      alt={session.user?.name ?? "User"}
                    />
                    <AvatarFallback className="bg-sky-500 text-sm text-white">
                      {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 border-slate-700 bg-slate-800"
                align="end"
              >
                <DropdownMenuItem
                  className="text-white hover:bg-slate-700 focus:bg-slate-700"
                  disabled
                >
                  <p className="text-sm font-medium">{session.user?.name}</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-white hover:bg-slate-700 focus:bg-slate-700"
                  onClick={() => signOut()}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => signIn()}
              size="sm"
              className="bg-sky-500 text-white hover:bg-sky-600"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block space-y-1 rounded-md p-3 leading-none text-white no-underline transition-colors outline-none select-none hover:bg-slate-700 hover:text-sky-500 focus:bg-slate-700 focus:text-sky-500",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium text-white">
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-300">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navigation;
