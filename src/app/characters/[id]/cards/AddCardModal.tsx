"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Plus, Minus } from "lucide-react";
import { AbilityCard } from "@/components/AbilityCard";
import { type Ability } from "@/lib/srd/abilities";
import { cn } from "@/lib/utils";

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableAbilities: Ability[];
  characterLevel: number;
  canSelectCard: (ability: Ability) => boolean;
  onSelectCard: (cardName: string) => void;
  isPending?: boolean;
}

export default function AddCardModal({
  isOpen,
  onClose,
  availableAbilities,
  characterLevel,
  canSelectCard,
  onSelectCard,
  isPending = false,
}: AddCardModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDomain, setFilterDomain] = useState<string>("ALL");
  const [minLevel, setMinLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(10);

  // Get unique domains from available abilities
  const availableDomains = useMemo(() => {
    const domains = new Set(
      availableAbilities.map((ability) => ability.domain),
    );
    return Array.from(domains).sort();
  }, [availableAbilities]);

  // Filter abilities based on search, domain, and level range
  const filteredAbilities = useMemo(() => {
    return availableAbilities.filter((ability) => {
      const matchesSearch =
        ability.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ability.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain =
        filterDomain === "ALL" || ability.domain === filterDomain;
      const abilityLevel = parseInt(ability.level);
      const matchesLevel = abilityLevel >= minLevel && abilityLevel <= maxLevel;

      return matchesSearch && matchesDomain && matchesLevel;
    });
  }, [availableAbilities, searchTerm, filterDomain, minLevel, maxLevel]);

  // Group abilities by level for better display
  const groupedAbilities = useMemo(() => {
    const groups: Record<string, Ability[]> = {};
    filteredAbilities.forEach((ability) => {
      if (!groups[ability.level]) {
        groups[ability.level] = [];
      }
      groups[ability.level]!.push(ability);
    });
    return groups;
  }, [filteredAbilities]);

  const handleSelectCard = (cardName: string) => {
    onSelectCard(cardName);
    onClose();
    // Reset filters
    setSearchTerm("");
    setFilterDomain("ALL");
    setMinLevel(1);
    setMaxLevel(10);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[100vh] max-h-[100vh] !w-[100vw] !max-w-[100vw] flex-col overflow-hidden border-slate-700 bg-slate-800 sm:h-auto sm:max-h-[90vh] lg:!w-[90vw] lg:!max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Card to Deck</DialogTitle>
          <DialogDescription className="text-slate-400">
            Browse and select ability cards to add to your character&apos;s
            deck.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search cards by name or text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-600 bg-slate-700 pl-10 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Domain Filter */}
            <div className="space-y-2">
              <Label className="text-sm text-slate-300">Domain</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterDomain === "ALL" ? "default" : "outline"}
                  onClick={() => setFilterDomain("ALL")}
                  size="sm"
                  className={cn(
                    filterDomain === "ALL"
                      ? "bg-sky-500 text-white hover:bg-sky-600"
                      : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600",
                  )}
                >
                  All Domains
                </Button>
                {availableDomains.map((domain) => (
                  <Button
                    key={domain}
                    variant={filterDomain === domain ? "default" : "outline"}
                    onClick={() => setFilterDomain(domain)}
                    size="sm"
                    className={cn(
                      filterDomain === domain
                        ? "bg-sky-500 text-white hover:bg-sky-600"
                        : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600",
                    )}
                  >
                    {domain}
                  </Button>
                ))}
              </div>
            </div>

            {/* Level Range Filter */}
            <div className="flex w-full gap-4">
              <div className="max-w-20 flex-grow">
                <Label htmlFor="min-level" className="text-sm text-slate-300">
                  Min Level
                </Label>
                <Input
                  id="min-level"
                  type="number"
                  value={minLevel}
                  onChange={(e) =>
                    setMinLevel(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min={1}
                  max={10}
                  className="border-slate-600 bg-slate-700 text-white"
                />
              </div>
              <Minus className="mt-6" />
              <div className="max-w-20 flex-grow">
                <Label htmlFor="max-level" className="text-sm text-slate-300">
                  Max Level
                </Label>
                <Input
                  id="max-level"
                  type="number"
                  value={maxLevel}
                  onChange={(e) =>
                    setMaxLevel(Math.min(10, parseInt(e.target.value) || 10))
                  }
                  min={1}
                  max={10}
                  className="flex-1 flex-grow border-slate-600 bg-slate-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {filteredAbilities.length} of {availableAbilities.length}{" "}
              available cards
            </p>
            {filteredAbilities.length > 0 && (
              <p className="text-xs text-slate-500">
                Levels{" "}
                {Math.min(...filteredAbilities.map((a) => parseInt(a.level)))} -{" "}
                {Math.max(...filteredAbilities.map((a) => parseInt(a.level)))}
              </p>
            )}
          </div>

          {/* Cards List */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedAbilities).map(([level, abilities]) => (
              <div key={level} className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    Level {level}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-slate-700 text-slate-300"
                  >
                    {abilities.length} cards
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {abilities.map((ability, index) => (
                    <div key={`${ability.name}-${index}`} className="relative">
                      <AbilityCard
                        name={ability.name}
                        text={ability.text}
                        level={ability.level}
                        domain={ability.domain}
                        recall={ability.recall}
                        tokens={0}
                        isSelected={false}
                        isOwner={true}
                        characterLevel={characterLevel}
                        canSelect={canSelectCard(ability)}
                        holdsTokens={ability.holdsTokens}
                      />
                      {canSelectCard(ability) && (
                        <Button
                          size="sm"
                          className="absolute top-12 right-2 z-10 bg-sky-500 text-white hover:bg-sky-600"
                          disabled={isPending}
                          onClick={() => handleSelectCard(ability.name)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredAbilities.length === 0 && (
              <div className="py-12 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-semibold text-white">
                  No cards found
                </h3>
                <p className="mt-1 text-slate-400">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
