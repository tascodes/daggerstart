import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import DomainBadge from "~/components/DomainBadge";
import { cn } from "~/lib/utils";
import { parseMarkdownText } from "~/lib/utils/markdown";
import { Check } from "lucide-react";

interface AbilityCardProps {
  name: string;
  text: string;
  tokens: number;
  level: string;
  domain: string;
  isSelected?: boolean;
  isOwner?: boolean;
  onSelect?: () => void;
  onDeselect?: () => void;
  canSelect?: boolean;
  characterLevel?: number;
  className?: string;
}

export const AbilityCard = ({
  name,
  text,
  tokens,
  level,
  domain,
  isSelected = false,
  isOwner = false,
  onDeselect,
  className,
}: AbilityCardProps) => {
  return (
    <Card
      className={cn(
        "relative flex flex-col border-slate-700 bg-slate-800 transition-all",
        isSelected && "border-sky-500 bg-slate-700 ring-2 ring-sky-500/20",
        className,
      )}
    >
      {/* Level Badge in top-right corner */}
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="secondary" className="bg-purple-600 text-white">
          Level {level}
        </Badge>
      </div>

      <CardHeader className="pr-16 pb-2">
        <CardTitle className="text-lg font-bold text-white">{name}</CardTitle>
        <div className="mt-2">
          <DomainBadge domain={domain} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between">
        <div className="text-sm text-slate-300">{parseMarkdownText(text)}</div>

        <div className="mt-4 space-y-3">
          {/* Token visualization */}
          <div className="flex gap-2">
            {Array.from({ length: tokens }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-8 rounded-full bg-sky-500 shadow-lg"
              />
            ))}
          </div>

          {/* Selection button for owner */}
          {isOwner && isSelected && (
            <div className="flex justify-center">
              <Button
                onClick={onDeselect}
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Check className="mr-1 h-4 w-4" />
                Selected
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
