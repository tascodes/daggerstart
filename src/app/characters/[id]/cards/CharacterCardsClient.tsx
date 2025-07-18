"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AbilityCard } from "@/components/AbilityCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Abilities, type Ability } from "@/lib/srd/abilities";
import { classes } from "@/lib/srd/classes";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import AddCardModal from "./AddCardModal";

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  game: {
    id: string;
    name: string;
  } | null;
}

interface CharacterCardsClientProps {
  characterId: string;
  character: Character;
  debugMode?: boolean;
}

interface CardSectionProps {
  title: string;
  abilities: Ability[];
  isOwner: boolean;
  characterLevel: number;
  onCardAction?: (cardName: string) => void;
  onMoveToVault?: (cardName: string) => void;
  onMoveToLoadout?: (cardName: string) => void;
  isSelected: boolean;
  canSelectCard: (ability: Ability) => boolean;
  emptyMessage?: string;
  location?: "available" | "loadout" | "vault";
  isLoadoutFull?: boolean;
  selectedCards?: Array<{ cardName: string; tokens: number; inLoadout: boolean }>;
  onAddToken?: (cardName: string, currentTokens: number) => void;
  onRemoveToken?: (cardName: string, currentTokens: number) => void;
}

const CardSection = ({
  title,
  abilities,
  isOwner,
  characterLevel,
  onCardAction,
  onMoveToVault,
  onMoveToLoadout,
  isSelected,
  canSelectCard,
  emptyMessage,
  location = "available",
  isLoadoutFull = false,
  selectedCards = [],
  onAddToken,
  onRemoveToken,
}: CardSectionProps) => (
  <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-lg">
    <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
    {abilities.length === 0 && emptyMessage ? (
      <p className="text-center text-slate-400">{emptyMessage}</p>
    ) : (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {abilities.map((ability: Ability, index: number) => {
          const cardTokens = selectedCards.find(card => card.cardName === ability.name)?.tokens ?? 0;
          return (
            <AbilityCard
              key={`${ability.name}-${index}`}
              name={ability.name}
              text={ability.text}
              level={ability.level}
              domain={ability.domain}
              recall={ability.recall}
              tokens={cardTokens}
              isSelected={isSelected}
              isOwner={isOwner}
              characterLevel={characterLevel}
              onSelect={isSelected ? undefined : () => onCardAction?.(ability.name)}
              onDeselect={
                isSelected ? () => onCardAction?.(ability.name) : undefined
              }
              onMoveToVault={
                location === "loadout" ? () => onMoveToVault?.(ability.name) : undefined
              }
              onMoveToLoadout={
                location === "vault" ? () => onMoveToLoadout?.(ability.name) : undefined
              }
              canSelect={isSelected ? true : canSelectCard(ability)}
              location={location}
              isLoadoutFull={isLoadoutFull}
              holdsTokens={ability.holdsTokens}
              onAddToken={() => onAddToken?.(ability.name, cardTokens)}
              onRemoveToken={() => onRemoveToken?.(ability.name, cardTokens)}
            />
          );
        })}
      </div>
    )}
  </div>
);

export default function CharacterCardsClient({
  characterId,
  character,
  debugMode = false,
}: CharacterCardsClientProps) {
  const { data: session } = useSession();
  const isOwner = character.user.id === session?.user.id;
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // Fetch selected cards data
  const { data: cardData } = api.character.getSelectedCards.useQuery({
    id: characterId,
  });

  const utils = api.useUtils();

  const selectCardMutation = api.character.selectCard.useMutation({
    onSuccess: () => {
      void utils.character.getSelectedCards.invalidate({ id: characterId });
    },
    onError: (error) => {
      console.error("Failed to select card:", error);
    },
  });

  const deselectCardMutation = api.character.deselectCard.useMutation({
    onSuccess: () => {
      void utils.character.getSelectedCards.invalidate({ id: characterId });
    },
    onError: (error) => {
      console.error("Failed to deselect card:", error);
    },
  });

  const moveToVaultMutation = api.character.moveCardToVault.useMutation({
    onSuccess: () => {
      void utils.character.getSelectedCards.invalidate({ id: characterId });
    },
    onError: (error) => {
      console.error("Failed to move card to vault:", error);
    },
  });

  const moveToLoadoutMutation = api.character.moveCardToLoadout.useMutation({
    onSuccess: () => {
      void utils.character.getSelectedCards.invalidate({ id: characterId });
    },
    onError: (error) => {
      console.error("Failed to move card to loadout:", error);
    },
  });

  const updateCardTokensMutation = api.character.updateCardTokens.useMutation({
    onMutate: async (newData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await utils.character.getSelectedCards.cancel({ id: characterId });

      // Snapshot the previous value
      const previousData = utils.character.getSelectedCards.getData({ id: characterId });

      // Optimistically update the cache
      utils.character.getSelectedCards.setData({ id: characterId }, (old) => {
        if (!old) return old;
        
        return {
          ...old,
          loadoutCards: old.loadoutCards?.map(card => 
            card.cardName === newData.cardName 
              ? { ...card, tokens: newData.tokens }
              : card
          ),
          vaultCards: old.vaultCards?.map(card => 
            card.cardName === newData.cardName 
              ? { ...card, tokens: newData.tokens }
              : card
          ),
          selectedCards: old.selectedCards?.map(card => 
            card.cardName === newData.cardName 
              ? { ...card, tokens: newData.tokens }
              : card
          ),
        };
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        utils.character.getSelectedCards.setData({ id: characterId }, context.previousData);
      }
      console.error("Failed to update card tokens:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      void utils.character.getSelectedCards.invalidate({ id: characterId });
    },
  });

  // Get character's available abilities and separate loadout/vault/available
  const { loadoutAbilities, vaultAbilities, availableAbilities } = useMemo(() => {
    if (!character?.class || !cardData) {
      return { loadoutAbilities: [], vaultAbilities: [], availableAbilities: [] };
    }

    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === character.class.toLowerCase(),
    );

    if (!classData) {
      return { loadoutAbilities: [], vaultAbilities: [], availableAbilities: [] };
    }

    const domains = [classData.domain_1, classData.domain_2];
    const selectedCardNames =
      cardData.selectedCards?.map((card) => card.cardName) ?? [];
    const loadoutCardNames =
      cardData.loadoutCards?.map((card) => card.cardName) ?? [];
    const vaultCardNames =
      cardData.vaultCards?.map((card) => card.cardName) ?? [];

    const abilities = Abilities.filter((ability: Ability) => {
      const abilityLevel = parseInt(ability.level);
      return (
        domains.includes(ability.domain) && abilityLevel <= character.level
      );
    }).sort((a, b) => {
      // First sort by level (lowest to highest)
      const levelA = parseInt(a.level);
      const levelB = parseInt(b.level);
      if (levelA !== levelB) {
        return levelA - levelB;
      }

      // Then sort by domain alphabetically
      return a.domain.localeCompare(b.domain);
    });

    const loadout = abilities.filter((ability) =>
      loadoutCardNames.includes(ability.name),
    );

    const vault = abilities.filter((ability) =>
      vaultCardNames.includes(ability.name),
    );

    const available = abilities.filter(
      (ability) => !selectedCardNames.includes(ability.name),
    );

    return {
      loadoutAbilities: loadout,
      vaultAbilities: vault,
      availableAbilities: available,
    };
  }, [character?.class, character?.level, cardData]);

  // Card interaction handlers
  const handleSelectCard = (cardName: string) => {
    selectCardMutation.mutate({ characterId, cardName });
  };

  const handleDeselectCard = (cardName: string) => {
    deselectCardMutation.mutate({ characterId, cardName });
  };

  const handleMoveToVault = (cardName: string) => {
    moveToVaultMutation.mutate({ characterId, cardName });
  };

  const handleMoveToLoadout = (cardName: string) => {
    moveToLoadoutMutation.mutate({ characterId, cardName });
  };

  const handleAddToken = (cardName: string, currentTokens: number) => {
    if (currentTokens < 8) {
      updateCardTokensMutation.mutate({
        characterId,
        cardName,
        tokens: currentTokens + 1,
      });
    }
  };

  const handleRemoveToken = (cardName: string, currentTokens: number) => {
    if (currentTokens > 0) {
      updateCardTokensMutation.mutate({
        characterId,
        cardName,
        tokens: currentTokens - 1,
      });
    }
  };

  // Check if a specific card can be selected based on level validation
  const canSelectCard = (ability: Ability) => {
    if (!cardData?.actualSlotsByLevel) return false;

    const cardLevel = parseInt(ability.level);
    if (cardLevel > character.level) return false;

    const levelInfo = cardData.actualSlotsByLevel[cardLevel];
    return levelInfo?.canSelectThisLevel ?? false;
  };

  const isLoadoutFull = loadoutAbilities.length >= 5;

  if (!character) {
    return null; // Layout will handle the not found case
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Card Slots Info */}
      {cardData && (
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-white">Card Slots</h3>
              <Badge variant="secondary" className="bg-sky-500 text-white">
                {cardData.usedSlots} / {cardData.availableSlots} Total Selected
              </Badge>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                {cardData.loadoutCards?.length ?? 0} / 5 in Loadout
              </Badge>
            </div>
            {cardData.usedSlots >= cardData.availableSlots && isOwner && (
              <p className="text-sm text-yellow-400">
                All card slots filled! Level up or choose Domain Cards to get
                more slots.
              </p>
            )}
          </div>

          {/* Show actual slots by level - debug mode only */}
          {debugMode && cardData?.actualSlotsByLevel && (
            <div className="space-y-2">
              <p className="text-sm text-slate-300">
                Card slots by level (higher level slots can be used for lower
                level cards):
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(cardData.actualSlotsByLevel).map(
                  ([level, slotInfo]) => (
                    <Badge
                      key={level}
                      variant="outline"
                      className={cn(
                        slotInfo.canSelectThisLevel
                          ? "border-green-500 text-green-300"
                          : slotInfo.available > 0
                            ? "border-purple-500 text-purple-300"
                            : "border-red-500 text-red-400",
                      )}
                      title={
                        !slotInfo.canSelectThisLevel
                          ? `Level ${level} cards blocked - no available slots at this level or higher`
                          : undefined
                      }
                    >
                      L{level}: {slotInfo.used}/{slotInfo.total}
                      {!slotInfo.canSelectThisLevel && " 🚫"}
                    </Badge>
                  ),
                )}
              </div>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                <p>🟢 Green: Can select cards of this level</p>
                <p>
                  🟣 Purple: Slots available but cards of this level blocked
                </p>
                <p>🔴 Red: No slots available at this level</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loadout Section */}
      <CardSection
        title={`Loadout (${loadoutAbilities.length}/5)`}
        abilities={loadoutAbilities}
        isOwner={isOwner}
        characterLevel={character.level}
        onCardAction={handleDeselectCard}
        onMoveToVault={handleMoveToVault}
        isSelected={true}
        canSelectCard={canSelectCard}
        location="loadout"
        emptyMessage="No cards in loadout. Add cards from your available cards below."
        selectedCards={cardData?.loadoutCards}
        onAddToken={handleAddToken}
        onRemoveToken={handleRemoveToken}
      />

      {/* Vault Section */}
      {vaultAbilities.length > 0 && (
        <CardSection
          title={`Vault (${vaultAbilities.length})`}
          abilities={vaultAbilities}
          isOwner={isOwner}
          characterLevel={character.level}
          onCardAction={handleDeselectCard}
          onMoveToLoadout={handleMoveToLoadout}
          isSelected={true}
          canSelectCard={canSelectCard}
          location="vault"
          isLoadoutFull={isLoadoutFull}
          selectedCards={cardData?.vaultCards}
          onAddToken={handleAddToken}
          onRemoveToken={handleRemoveToken}
        />
      )}

      {/* Add Card Button */}
      {isOwner && cardData && cardData.usedSlots < cardData.availableSlots && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsAddCardModalOpen(true)}
            size="lg"
            className="bg-sky-500 text-white hover:bg-sky-600"
          >
            <Plus className="mr-2 h-5 w-5" />
            Browse Available Cards ({availableAbilities.length})
          </Button>
        </div>
      )}

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => setIsAddCardModalOpen(false)}
        availableAbilities={availableAbilities}
        characterLevel={character.level}
        canSelectCard={canSelectCard}
        onSelectCard={handleSelectCard}
        isPending={selectCardMutation.isPending}
      />
    </div>
  );
}
