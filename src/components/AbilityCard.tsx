import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DomainBadge from "@/components/DomainBadge";
import { cn } from "@/lib/utils";
import { parseMarkdownText } from "@/lib/utils/markdown";
import { Archive, Swords, Zap, X, MoreVertical, Plus, Minus } from "lucide-react";

interface AbilityCardProps {
  name: string;
  text: string;
  tokens: number;
  level: string;
  domain: string;
  recall: string;
  isSelected?: boolean;
  isOwner?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
  onMoveToVault?: () => void;
  onMoveToLoadout?: () => void;
  canSelect?: boolean;
  characterLevel?: number;
  className?: string;
  location?: "available" | "loadout" | "vault";
  isLoadoutFull?: boolean;
  holdsTokens?: boolean;
  onAddToken?: () => void;
  onRemoveToken?: () => void;
}

export const AbilityCard = ({
  name,
  text,
  tokens,
  level,
  domain,
  recall,
  isSelected = false,
  isOwner = false,
  onDeselect,
  onMoveToVault,
  onMoveToLoadout,
  className,
  location = "available",
  isLoadoutFull = false,
  holdsTokens = false,
  onAddToken,
  onRemoveToken,
}: AbilityCardProps) => {
  return (
    <Card
      className={cn(
        "relative flex h-[400px] flex-col gap-0 border-slate-700 bg-slate-800 transition-all",
        isSelected && "border-sky-500 bg-slate-700 ring-2 ring-sky-500/20",
        className,
      )}
    >
      {/* Level Badge in top-left corner */}
      <div className="absolute top-2 left-2 z-10">
        <Badge variant="secondary" className="ml-1.5 bg-purple-600 text-white">
          Level {level}
        </Badge>
        <DomainBadge className="ml-1.5" domain={domain} />
      </div>

      {/* Recall Cost and Actions in top-right corner */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Badge variant="secondary" className="bg-yellow-600 text-white">
          <Zap />
          {recall}
        </Badge>
        {isOwner && isSelected && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600"
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-slate-800 border-slate-700"
            >
              {location === "loadout" && (
                <>
                  <DropdownMenuItem
                    onClick={onMoveToVault}
                    className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Move to Vault
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDeselect}
                    className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Card
                  </DropdownMenuItem>
                </>
              )}
              {location === "vault" && (
                <>
                  <DropdownMenuItem
                    onClick={onMoveToLoadout}
                    disabled={isLoadoutFull}
                    className="text-slate-200 hover:bg-slate-700 cursor-pointer disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    <Swords className="mr-2 h-4 w-4" />
                    Move to Loadout
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDeselect}
                    className="text-slate-200 hover:bg-slate-700 cursor-pointer"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove Card
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <CardHeader className="pt-4">
        <CardTitle className="text-left text-lg font-bold text-white">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col overflow-hidden pt-2">
        <div className="flex-1 overflow-y-auto pr-2 text-sm text-slate-300">
          {parseMarkdownText(text)}
        </div>

        <div className="mt-4 flex-shrink-0 space-y-3">
          {/* Token visualization and controls */}
          {holdsTokens && (
            <div className="flex items-center justify-between">
              {/* Token discs */}
              <div className="flex flex-wrap gap-1 flex-1">
                {Array.from({ length: tokens }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 border border-sky-300 shadow-lg relative"
                    style={{
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-t from-sky-500 to-sky-300 opacity-60" />
                  </div>
                ))}
              </div>
              
              {/* Token controls */}
              {isOwner && isSelected && (
                <div className="flex gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onRemoveToken}
                    disabled={tokens === 0}
                    className="h-6 w-6 p-0 border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAddToken}
                    disabled={tokens >= 8}
                    className="h-6 w-6 p-0 border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Legacy token visualization for non-holdsTokens cards */}
          {!holdsTokens && tokens > 0 && (
            <div className="flex gap-2">
              {Array.from({ length: tokens }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 rounded-full bg-sky-500 shadow-lg"
                />
              ))}
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
};
