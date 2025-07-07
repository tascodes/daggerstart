"use client";

import StatBar from "./StatBar";

interface HealthBarProps {
  label: string;
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
}

const HealthBar = ({
  label,
  value,
  maxValue,
  onValueChange,
  disabled = false,
}: HealthBarProps) => {
  // Calculate color based on HP proximity to max
  const getBarColor = () => {
    const distanceFromMax = maxValue - value;

    if (distanceFromMax === 0) {
      // At max HP - dark red
      return {
        filled: "border-red-800 bg-red-900",
        empty: "border-slate-600 bg-transparent",
        border: "hover:border-red-700",
      };
    } else if (distanceFromMax <= 2) {
      // Within 2 of max HP - yellow
      return {
        filled: "border-yellow-400 bg-yellow-500",
        empty: "border-slate-600 bg-transparent",
        border: "hover:border-yellow-400",
      };
    }

    // Default green color for low HP
    return {
      filled: "border-green-400 bg-green-500",
      empty: "border-slate-600 bg-transparent",
      border: "hover:border-green-400",
    };
  };

  return (
    <StatBar
      label={label}
      value={value}
      maxValue={maxValue}
      onValueChange={onValueChange}
      disabled={disabled}
      barColor={getBarColor()}
    />
  );
};

export default HealthBar;
