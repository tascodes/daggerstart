import { getDiceRollOutcome } from "~/utils/dice";

interface RollOutcomeBadgeProps {
  hopeResult: number;
  fearResult: number;
  size?: "sm" | "md";
  className?: string;
}

export default function RollOutcomeBadge({
  hopeResult,
  fearResult,
  size = "md",
  className = "",
}: RollOutcomeBadgeProps) {
  const outcome = getDiceRollOutcome(hopeResult, fearResult);

  const sizeClasses = {
    sm: "px-1 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
  };

  const getOutcomeClasses = (outcome: string) => {
    switch (outcome) {
      case "Critical":
        return "bg-purple-600 text-white";
      case "with Hope":
        return "bg-yellow-600 text-white";
      case "with Fear":
        return "bg-red-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <span
      className={`rounded font-bold ${sizeClasses[size]} ${getOutcomeClasses(outcome)} ${className}`}
    >
      {outcome}
    </span>
  );
}
