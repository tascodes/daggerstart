"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Plus,
  Search,
  Package,
  Shield,
  Sword,
  Zap,
  Edit2,
  Trash2,
  Minus,
} from "lucide-react";
import GoldSection from "~/components/GoldSection";
import { api } from "~/trpc/react";
import { type ItemType } from "@prisma/client";
import AddItemModal from "./AddItemModal";
import { Items, type Item } from "~/lib/srd/items";
import { Armors, type Armor } from "~/lib/srd/armor";
import { Weapons, type Weapon } from "~/lib/srd/weapons";
import { Consumables, type Consumable } from "~/lib/srd/consumables";

interface CharacterInventoryClientProps {
  characterId: string;
}

export default function CharacterInventoryClient({
  characterId,
}: CharacterInventoryClientProps) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ItemType | "ALL">("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState<string | null>(null);
  const [tempQuantity, setTempQuantity] = useState<number>(0);

  const { data: character } = api.character.getById.useQuery({
    id: characterId,
  });

  const { data: inventory, refetch } = api.character.getInventory.useQuery({
    characterId,
  });

  const refetchCharacter = () =>
    void utils.character.getById.invalidate({ id: characterId });

  const utils = api.useUtils();

  const updateQuantityMutation = api.character.updateInventoryItem.useMutation({
    onSuccess: () => {
      void refetch();
      setEditingQuantity(null);
    },
  });

  const deleteItemMutation = api.character.deleteInventoryItem.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const isOwner = character?.user.id === session?.user.id;

  // Get item details from SRD
  const getItemDetails = (
    itemName: string,
    itemType: ItemType,
  ): Item | Armor | Weapon | Consumable | null => {
    switch (itemType) {
      case "ITEM":
        return Items.find((item) => item.name === itemName) ?? null;
      case "ARMOR":
        return Armors.find((armor) => armor.name === itemName) ?? null;
      case "WEAPON":
        return Weapons.find((weapon) => weapon.name === itemName) ?? null;
      case "CONSUMABLE":
        return (
          Consumables.find((consumable) => consumable.name === itemName) ?? null
        );
      default:
        return null;
    }
  };

  // Filter inventory based on search and type
  const filteredInventory =
    inventory?.filter((item) => {
      const matchesSearch = item.itemName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType = filterType === "ALL" || item.itemType === filterType;
      return matchesSearch && matchesType;
    }) ?? [];

  // Group items by type and apply sorting
  const groupedInventory = {
    ITEM: filteredInventory
      .filter((item) => item.itemType === "ITEM")
      .sort((a, b) => a.itemName.localeCompare(b.itemName)),
    ARMOR: filteredInventory
      .filter((item) => item.itemType === "ARMOR")
      .sort((a, b) => {
        const aDetails = getItemDetails(a.itemName, a.itemType) as Armor;
        const bDetails = getItemDetails(b.itemName, b.itemType) as Armor;
        if (aDetails && bDetails) {
          const aTier = parseInt(aDetails.tier);
          const bTier = parseInt(bDetails.tier);
          if (aTier !== bTier) return aTier - bTier;
        }
        return a.itemName.localeCompare(b.itemName);
      }),
    WEAPON: filteredInventory
      .filter((item) => item.itemType === "WEAPON")
      .sort((a, b) => {
        const aDetails = getItemDetails(a.itemName, a.itemType) as Weapon;
        const bDetails = getItemDetails(b.itemName, b.itemType) as Weapon;
        if (aDetails && bDetails) {
          const aTier = parseInt(aDetails.tier);
          const bTier = parseInt(bDetails.tier);
          if (aTier !== bTier) return aTier - bTier;
        }
        return a.itemName.localeCompare(b.itemName);
      }),
    CONSUMABLE: filteredInventory
      .filter((item) => item.itemType === "CONSUMABLE")
      .sort((a, b) => a.itemName.localeCompare(b.itemName)),
  };

  const getTypeIcon = (type: ItemType) => {
    switch (type) {
      case "ITEM":
        return <Package className="h-4 w-4" />;
      case "ARMOR":
        return <Shield className="h-4 w-4" />;
      case "WEAPON":
        return <Sword className="h-4 w-4" />;
      case "CONSUMABLE":
        return <Zap className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: ItemType) => {
    switch (type) {
      case "ITEM":
        return "Items";
      case "ARMOR":
        return "Armor";
      case "WEAPON":
        return "Weapons";
      case "CONSUMABLE":
        return "Consumables";
      default:
        return "Items";
    }
  };

  const handleQuantityEdit = (itemId: string, currentQuantity: number) => {
    setEditingQuantity(itemId);
    setTempQuantity(currentQuantity);
  };

  const handleQuantitySave = (itemId: string) => {
    updateQuantityMutation.mutate({
      id: itemId,
      quantity: tempQuantity,
    });
  };

  const handleQuantityCancel = () => {
    setEditingQuantity(null);
    setTempQuantity(0);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate({ id: itemId });
    }
  };

  const renderItemDetails = (
    item: { itemName: string },
    itemType: ItemType,
  ) => {
    const details = getItemDetails(item.itemName, itemType);
    if (!details) return null;

    switch (itemType) {
      case "ITEM":
      case "CONSUMABLE":
        const itemOrConsumable = details as Item | Consumable;
        return (
          <div className="mt-2">
            <p className="text-sm text-slate-300">
              {itemOrConsumable.description}
            </p>
          </div>
        );
      case "ARMOR":
        const armor = details as Armor;
        return (
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Tier:</span>
                <span className="ml-2 text-white">{armor.tier}</span>
              </div>
              <div>
                <span className="text-slate-400">Base Score:</span>
                <span className="ml-2 text-white">{armor.base_score}</span>
              </div>
              <div>
                <span className="text-slate-400">Thresholds:</span>
                <span className="ml-2 text-white">{armor.base_thresholds}</span>
              </div>
            </div>
            {armor.feat_name && (
              <div className="rounded-lg bg-slate-700 p-3">
                <div className="text-sm font-semibold text-yellow-400">
                  {armor.feat_name}
                </div>
                <div className="text-sm text-slate-300">{armor.feat_text}</div>
              </div>
            )}
          </div>
        );
      case "WEAPON":
        const weapon = details as Weapon;
        return (
          <div className="mt-2 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Type:</span>
                <span className="ml-2 text-white">
                  {weapon.primary_or_secondary}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Tier:</span>
                <span className="ml-2 text-white">{weapon.tier}</span>
              </div>
              <div>
                <span className="text-slate-400">Trait:</span>
                <span className="ml-2 text-white">{weapon.trait}</span>
              </div>
              <div>
                <span className="text-slate-400">Range:</span>
                <span className="ml-2 text-white">{weapon.range}</span>
              </div>
              <div>
                <span className="text-slate-400">Damage:</span>
                <span className="ml-2 text-white">
                  {weapon.damage.replace(/\s*(phy|mag)$/i, "")}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Burden:</span>
                <span className="ml-2 text-white">{weapon.burden}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400">Type:</span>
              <span className="ml-2 text-white">
                {weapon.physical_or_magical}
              </span>
            </div>
            {weapon.feat_name && (
              <div className="rounded-lg bg-slate-700 p-3">
                <div className="text-sm font-semibold text-yellow-400">
                  {weapon.feat_name}
                </div>
                <div className="text-sm text-slate-300">{weapon.feat_text}</div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (!character) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Gold Section */}
      {character && (
        <div className="mb-6">
          <GoldSection
            character={character}
            isOwner={isOwner}
            onUpdate={refetchCharacter}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Inventory</h1>
        {isOwner && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-sky-500 text-white hover:bg-sky-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="min-w-[300px] border-slate-600 bg-slate-700 pl-10 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["ALL", "ITEM", "ARMOR", "WEAPON", "CONSUMABLE"].map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              onClick={() => setFilterType(type as ItemType | "ALL")}
              className={`${
                filterType === type
                  ? "bg-sky-500 text-white hover:bg-sky-600"
                  : "border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {type === "ALL" ? "All" : getTypeName(type as ItemType)}
            </Button>
          ))}
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="space-y-6">
        {Object.entries(groupedInventory).map(([type, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={type}>
              <div className="mb-4 flex items-center gap-2">
                {getTypeIcon(type as ItemType)}
                <h2 className="text-lg font-semibold text-white">
                  {getTypeName(type as ItemType)}
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-slate-700 text-slate-300"
                >
                  {items.length}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card key={item.id} className="border-slate-700 bg-slate-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-white">
                          {item.itemName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            {editingQuantity === item.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={() =>
                                    setTempQuantity(
                                      Math.max(0, tempQuantity - 1),
                                    )
                                  }
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 border-slate-500 bg-slate-600 p-0 hover:bg-slate-500"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={tempQuantity}
                                  onChange={(e) =>
                                    setTempQuantity(
                                      parseInt(e.target.value) || 0,
                                    )
                                  }
                                  min={0}
                                  max={999}
                                  className="h-6 w-16 border-slate-500 bg-slate-600 text-center text-white"
                                />
                                <Button
                                  onClick={() =>
                                    setTempQuantity(
                                      Math.min(999, tempQuantity + 1),
                                    )
                                  }
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 border-slate-500 bg-slate-600 p-0 hover:bg-slate-500"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Badge className="bg-sky-500 text-white">
                                {item.quantity}
                              </Badge>
                            )}
                          </div>
                          {isOwner && (
                            <div className="flex items-center gap-1">
                              {editingQuantity === item.id ? (
                                <>
                                  <Button
                                    onClick={() => handleQuantitySave(item.id)}
                                    disabled={updateQuantityMutation.isPending}
                                    size="sm"
                                    className="h-6 w-6 bg-green-600 p-0 hover:bg-green-700"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={handleQuantityCancel}
                                    disabled={updateQuantityMutation.isPending}
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 border-slate-500 bg-slate-600 p-0 hover:bg-slate-500"
                                  >
                                    ×
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={() =>
                                      handleQuantityEdit(item.id, item.quantity)
                                    }
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-slate-400 hover:bg-slate-600 hover:text-white"
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteItem(item.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {renderItemDetails(item, item.itemType)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div className="py-12 text-center">
          <Package className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-semibold text-white">
            No items found
          </h3>
          <p className="mt-1 text-slate-400">
            {searchTerm || filterType !== "ALL"
              ? "Try adjusting your search or filters."
              : isOwner
                ? "Add some items to get started!"
                : "This character doesn't have any items yet."}
          </p>
        </div>
      )}

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        characterId={characterId}
        onItemAdded={() => void refetch()}
      />
    </div>
  );
}
