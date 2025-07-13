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
  onCardAction: (cardName: string) => void;
  isSelected: boolean;
  canSelectCard: (ability: Ability) => boolean;
  emptyMessage?: string;
}

const CardSection = ({
  title,
  abilities,
  isOwner,
  characterLevel,
  onCardAction,
  isSelected,
  canSelectCard,
  emptyMessage,
}: CardSectionProps) => (
  <div className="rounded-lg border border-slate-700 bg-slate-800 p-8 shadow-lg">
    <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
    {abilities.length === 0 && emptyMessage ? (
      <p className="text-center text-slate-400">{emptyMessage}</p>
    ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {abilities.map((ability: Ability, index: number) => (
          <AbilityCard
            key={`${ability.name}-${index}`}
            name={ability.name}
            text={ability.text}
            level={ability.level}
            domain={ability.domain}
            tokens={0}
            isSelected={isSelected}
            isOwner={isOwner}
            characterLevel={characterLevel}
            onSelect={isSelected ? undefined : () => onCardAction(ability.name)}
            onDeselect={
              isSelected ? () => onCardAction(ability.name) : undefined
            }
            canSelect={isSelected ? true : canSelectCard(ability)}
          />
        ))}
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

  // Get character's available abilities and separate selected/available
  const { selectedAbilities, availableAbilities } = useMemo(() => {
    if (!character?.class) {
      return { selectedAbilities: [], availableAbilities: [] };
    }

    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === character.class.toLowerCase(),
    );

    if (!classData) {
      return { selectedAbilities: [], availableAbilities: [] };
    }

    const domains = [classData.domain_1, classData.domain_2];
    const selectedCardNames =
      cardData?.selectedCards?.map((card) => card.cardName) ?? [];

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

    const selected = abilities.filter((ability) =>
      selectedCardNames.includes(ability.name),
    );

    const available = abilities.filter(
      (ability) => !selectedCardNames.includes(ability.name),
    );

    return {
      selectedAbilities: selected,
      availableAbilities: available,
    };
  }, [character?.class, character?.level, cardData?.selectedCards]);

  // Card interaction handlers
  const handleSelectCard = (cardName: string) => {
    selectCardMutation.mutate({ characterId, cardName });
  };

  const handleDeselectCard = (cardName: string) => {
    deselectCardMutation.mutate({ characterId, cardName });
  };

  // Check if a specific card can be selected based on level validation
  const canSelectCard = (ability: Ability) => {
    if (!cardData?.actualSlotsByLevel) return false;

    const cardLevel = parseInt(ability.level);
    if (cardLevel > character.level) return false;

    const levelInfo = cardData.actualSlotsByLevel[cardLevel];
    return levelInfo?.canSelectThisLevel ?? false;
  };

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
                {cardData.usedSlots} / {cardData.availableSlots} Selected
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

      {/* Selected Cards Section */}
      {selectedAbilities.length > 0 && (
        <CardSection
          title={`Selected Cards (${selectedAbilities.length})`}
          abilities={selectedAbilities}
          isOwner={isOwner}
          characterLevel={character.level}
          onCardAction={handleDeselectCard}
          isSelected={true}
          canSelectCard={canSelectCard}
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
