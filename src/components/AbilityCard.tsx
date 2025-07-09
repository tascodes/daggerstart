import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface AbilityCardProps {
  name: string;
  text: string;
  tokens: number;
  className?: string;
}

export const AbilityCard = ({
  name,
  text,
  tokens,
  className,
}: AbilityCardProps) => {
  return (
    <Card
      className={cn(
        "relative flex aspect-[2/3] flex-col border-slate-700 bg-slate-800",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-white">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between">
        <p className="text-sm text-slate-300">{text}</p>
        <div className="mt-4 flex gap-2">
          {Array.from({ length: tokens }).map((_, index) => (
            <div
              key={index}
              className="h-8 w-8 rounded-full bg-sky-500 shadow-lg"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
