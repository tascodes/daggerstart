"use client";

import { useState } from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Shield, Sword, Plus, Apple } from "lucide-react";
import { api } from "@/trpc/react";
import { type ItemType } from "@prisma/client";
import { Items, type Item } from "@/lib/srd/items";
import { Armors, type Armor } from "@/lib/srd/armor";
import { Weapons, type Weapon } from "@/lib/srd/weapons";
import { Consumables, type Consumable } from "@/lib/srd/consumables";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterId: string;
  onItemAdded: () => void;
}

type UnifiedItem =
  | (Item & { type: "ITEM" })
  | (Consumable & { type: "CONSUMABLE" })
  | (Armor & { type: "ARMOR" })
  | (Weapon & { type: "WEAPON" });

export default function AddItemModal({
  isOpen,
  onClose,
  characterId,
  onItemAdded,
}: AddItemModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ItemType | "ALL">("ALL");
  const [filterTier, setFilterTier] = useState<number | "ALL">("ALL");
  const [quantity, setQuantity] = useState(1);

  const addItemMutation = api.character.addInventoryItem.useMutation({
    onSuccess: () => {
      onItemAdded();
      onClose();
      setSearchTerm("");
      setFilterType("ALL");
      setFilterTier("ALL");
      setQuantity(1);
    },
  });

  // Combine all items with their types and sort them
  const allItems: UnifiedItem[] = [
    // Items and consumables sorted alphabetically
    ...Items.map((item) => ({ ...item, type: "ITEM" as const })).sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
    ...Consumables.map((consumable) => ({
      ...consumable,
      type: "CONSUMABLE" as const,
    })).sort((a, b) => a.name.localeCompare(b.name)),
    // Armor and weapons sorted by tier, then alphabetically
    ...Armors.map((armor) => ({ ...armor, type: "ARMOR" as const })).sort(
      (a, b) => {
        const aTier = parseInt(a.tier);
        const bTier = parseInt(b.tier);
        if (aTier !== bTier) return aTier - bTier;
        return a.name.localeCompare(b.name);
      },
    ),
    ...Weapons.map((weapon) => ({
      ...weapon,
      type: "WEAPON" as const,
    })).sort((a, b) => {
      const aTier = parseInt(a.tier);
      const bTier = parseInt(b.tier);
      if (aTier !== bTier) return aTier - bTier;
      return a.name.localeCompare(b.name);
    }),
  ];

  // Filter items based on search, type, and tier
  const filteredItems = allItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "ALL" || item.type === filterType;

    // Tier filter only applies to armor and weapons
    let matchesTier = true;
    if (
      filterTier !== "ALL" &&
      (item.type === "ARMOR" || item.type === "WEAPON")
    ) {
      matchesTier = parseInt((item as Armor | Weapon).tier) === filterTier;
    }

    return matchesSearch && matchesType && matchesTier;
  });

  // Get unique tiers from armor and weapons for filter options
  const availableTiers = Array.from(
    new Set([
      ...Armors.map((armor) => parseInt(armor.tier)),
      ...Weapons.map((weapon) => parseInt(weapon.tier)),
    ]),
  ).sort((a, b) => a - b);

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case "ITEM":
        return <Package className="h-4 w-4 text-blue-400" />;
      case "ARMOR":
        return <Shield className="h-4 w-4 text-green-400" />;
      case "WEAPON":
        return <Sword className="h-4 w-4 text-red-400" />;
      case "CONSUMABLE":
        return <Apple className="h-4 w-4 text-yellow-400" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: ItemType) => {
    switch (type) {
      case "ITEM":
        return "Item";
      case "ARMOR":
        return "Armor";
      case "WEAPON":
        return "Weapon";
      case "CONSUMABLE":
        return "Consumable";
      default:
        return "Item";
    }
  };

  const handleAddItem = (item: UnifiedItem) => {
    addItemMutation.mutate({
      characterId,
      itemName: item.name,
      itemType: item.type,
      quantity,
    });
  };

  const renderItemDetails = (item: UnifiedItem) => {
    switch (item.type) {
      case "ITEM":
      case "CONSUMABLE":
        const itemOrConsumable = item as (Item | Consumable) & {
          type: ItemType;
        };
        return (
          <p className="line-clamp-2 text-sm text-slate-400">
            {itemOrConsumable.description}
          </p>
        );
      case "ARMOR":
        const armor = item as Armor & { type: ItemType };
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <div>
                <span className="text-slate-400">Base Score: </span>
                <span className="font-semibold text-white">
                  {armor.base_score}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Thresholds: </span>
                <span className="font-semibold text-white">
                  {armor.base_thresholds}
                </span>
              </div>
            </div>
            {armor.feat_name && (
              <div className="mt-2 rounded-lg bg-slate-600 p-2">
                <div className="mb-1 text-xs font-semibold text-yellow-400">
                  {armor.feat_name}
                </div>
                <div className="text-xs text-slate-300">{armor.feat_text}</div>
              </div>
            )}
          </div>
        );
      case "WEAPON":
        const weapon = item as Weapon & { type: ItemType };
        return (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="text-slate-300">
                  {weapon.primary_or_secondary}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Trait:</span>
                <span className="text-slate-300">{weapon.trait}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Range:</span>
                <span className="text-slate-300">{weapon.range}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Damage:</span>
                <span className="text-slate-300">
                  {weapon.damage.replace(/\s*(phy|mag)$/i, "")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Burden:</span>
                <span className="text-slate-300">{weapon.burden}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-300">
                  {weapon.physical_or_magical}
                </span>
              </div>
            </div>
            {weapon.feat_name && (
              <div className="mt-2 rounded-lg bg-slate-600 p-2">
                <div className="mb-1 text-xs font-semibold text-yellow-400">
                  {weapon.feat_name}
                </div>
                <div className="text-xs text-slate-300">{weapon.feat_text}</div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[100vh] max-h-[100vh] !w-[100vw] !max-w-[100vw] flex-col overflow-hidden border-slate-700 bg-slate-800 sm:h-auto sm:max-h-[80vh] lg:!w-[80vw] lg:!max-w-[80vw]">
        <DialogHeader>
          <DialogTitle className="text-white">
            Add Item to Inventory
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Search and select items from the SRD to add to your character&apos;s
            inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
          {/* Search and Filter */}
          <div className="space-y-4">
            {/* Search Input - always on its own line */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-slate-600 bg-slate-700 pl-10 text-white placeholder:text-slate-400"
              />
            </div>
            {/* Filters */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                {["ALL", "ITEM", "ARMOR", "WEAPON", "CONSUMABLE"].map(
                  (type) => (
                    <Button
                      key={type}
                      variant={filterType === type ? "default" : "outline"}
                      onClick={() => setFilterType(type as ItemType | "ALL")}
                      size="sm"
                      className={`${
                        filterType === type
                          ? "bg-sky-500 text-white hover:bg-sky-600"
                          : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {type === "ALL" ? "All" : getTypeName(type as ItemType)}
                    </Button>
                  ),
                )}
              </div>
              {/* Tier Filter - always visible */}
              <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                <span className="self-center text-sm text-slate-400">
                  Tier:
                </span>
                {["ALL", ...availableTiers].map((tier) => (
                  <Button
                    key={tier}
                    variant={filterTier === tier ? "default" : "outline"}
                    onClick={() => setFilterTier(tier as number | "ALL")}
                    size="sm"
                    className={`${
                      filterTier === tier
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {tier === "ALL" ? "All" : `T${tier}`}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="flex items-center gap-4">
            <Label htmlFor="quantity" className="text-white">
              Quantity:
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min={1}
              max={999}
              className="w-20 border-slate-600 bg-slate-700 text-white"
            />
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card
                  key={`${item.type}-${item.name}`}
                  className="border-slate-600 bg-slate-700 px-3 py-2"
                >
                  <CardContent className="p-2">
                    <div className="flex items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <h3 className="font-semibold text-white">
                            {item.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-slate-600 text-xs text-slate-300"
                          >
                            {getTypeName(item.type)}
                          </Badge>
                          {(item.type === "ARMOR" ||
                            item.type === "WEAPON") && (
                            <Badge
                              variant="outline"
                              className="border-yellow-500 text-xs text-yellow-400"
                            >
                              Tier {(item as Armor | Weapon).tier}
                            </Badge>
                          )}
                        </div>
                        {renderItemDetails(item)}
                      </div>
                      <Button
                        size="sm"
                        className="flex-shrink-0 bg-sky-500 text-white hover:bg-sky-600"
                        disabled={addItemMutation.isPending}
                        onClick={() => handleAddItem(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-slate-400" />
                <h3 className="mt-2 text-lg font-semibold text-white">
                  No items found
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
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
