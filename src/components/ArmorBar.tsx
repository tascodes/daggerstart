"use client";

import StatBar from "./StatBar";

interface ArmorBarProps {
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
}

const ArmorBar = ({
  value,
  maxValue,
  onValueChange,
  disabled = false,
}: ArmorBarProps) => {
  return (
    <StatBar
      label="ARMOR"
      value={value}
      maxValue={maxValue}
      onValueChange={onValueChange}
      disabled={disabled}
      barColor={{
        filled: "border-slate-400 bg-slate-500",
        empty: "border-slate-600 bg-transparent",
        border: "hover:border-slate-400",
      }}
    />
  );
};

export default ArmorBar;
