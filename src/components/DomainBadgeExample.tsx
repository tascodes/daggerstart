"use client";

import { Domains } from "~/lib/srd/domains";
import DomainBadge from "./DomainBadge";

const DomainBadgeExample = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white">Domain Badges</h2>
      <div className="flex flex-wrap gap-2">
        {Domains.map((domain) => (
          <DomainBadge key={domain.name} domain={domain.name} />
        ))}
      </div>
    </div>
  );
};

export default DomainBadgeExample;