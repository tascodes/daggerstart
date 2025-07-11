"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CharacterTabsProps {
  characterId: string;
  activeTab?: string;
}

const CharacterTabs = ({ characterId, activeTab }: CharacterTabsProps) => {
  const pathname = usePathname();

  const tabs = [
    {
      id: "details",
      label: "Character Details",
      href: `/characters/${characterId}`,
      isActive:
        activeTab === "details" || pathname === `/characters/${characterId}`,
    },
    {
      id: "cards",
      label: "Cards",
      href: `/characters/${characterId}/cards`,
      isActive:
        activeTab === "cards" ||
        pathname === `/characters/${characterId}/cards`,
    },
    {
      id: "inventory",
      label: "Inventory",
      href: `/characters/${characterId}/inventory`,
      isActive:
        activeTab === "inventory" ||
        pathname === `/characters/${characterId}/inventory`,
    },
  ];

  return (
    <div className="border-b border-slate-700">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
              tab.isActive
                ? "border-sky-500 text-sky-400"
                : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-300"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default CharacterTabs;
