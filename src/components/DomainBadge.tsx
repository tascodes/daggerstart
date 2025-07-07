"use client";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const DomainColors = {
  Arcana: "bg-purple-600 text-white border-purple-700",
  Codex: "bg-blue-600 text-white border-blue-700", 
  Grace: "bg-pink-600 text-white border-pink-700",
  Blade: "bg-red-600 text-white border-red-700",
  Midnight: "bg-black text-white border-gray-700",
  Sage: "bg-green-600 text-white border-green-700",
  Splendor: "bg-yellow-500 text-black border-yellow-600",
  Valor: "bg-orange-600 text-white border-orange-700",
  Bone: "bg-white text-black border-gray-300",
} as const;

type DomainName = keyof typeof DomainColors;

interface DomainBadgeProps {
  domain: string;
  className?: string;
}

const DomainBadge = ({ domain, className }: DomainBadgeProps) => {
  const domainKey = domain as DomainName;
  const colorClasses = DomainColors[domainKey] || "bg-gray-500 text-white border-gray-600";

  return (
    <Badge
      className={cn(
        "font-medium text-xs px-2 py-1",
        colorClasses,
        className
      )}
    >
      {domain}
    </Badge>
  );
};

export default DomainBadge;