import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface AbilityCardProps {
  name: string;
  text: string;
  tokens: number;
  className?: string;
}

export const AbilityCard = ({ name, text, tokens, className }: AbilityCardProps) => {
  return (
    <Card className={cn("relative aspect-[2/3] flex flex-col bg-slate-800 border-slate-700", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-white">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <p className="text-sm text-slate-300 line-clamp-6">{text}</p>
        <div className="flex gap-2 mt-4">
          {Array.from({ length: tokens }).map((_, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full bg-sky-500 shadow-lg shadow-sky-500/50"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};