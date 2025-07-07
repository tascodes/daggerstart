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
      href: `/character/${characterId}`,
      isActive: activeTab === "details" || pathname === `/character/${characterId}`,
    },
    {
      id: "cards",
      label: "Cards",
      href: `/character/${characterId}/cards`,
      isActive: activeTab === "cards" || pathname === `/character/${characterId}/cards`,
    },
  ];

  return (
    <div className="border-b border-slate-700">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
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