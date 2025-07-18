"use client";

import StatBar from "./StatBar";

interface StressBarProps {
  label: string;
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
}

const StressBar = ({
  label,
  value,
  maxValue,
  onValueChange,
  disabled = false,
}: StressBarProps) => {
  return (
    <StatBar
      label={label}
      value={value}
      maxValue={maxValue}
      onValueChange={onValueChange}
      disabled={disabled}
      barColor={{
        filled: "border-sky-400 bg-sky-500",
        empty: "border-slate-600 bg-transparent",
        border: "hover:border-sky-400",
      }}
    />
  );
};

export default StressBar;
