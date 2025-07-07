"use client";

import StatBar from "./StatBar";

interface FearBarProps {
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
}

const FearBar = ({
  value,
  maxValue,
  onValueChange,
  disabled = false,
}: FearBarProps) => {
  return (
    <StatBar
      label="FEAR"
      value={value}
      maxValue={maxValue}
      onValueChange={onValueChange}
      disabled={disabled}
      barColor={{
        filled: "border-purple-400 bg-purple-500",
        empty: "border-slate-600 bg-transparent",
        border: "hover:border-purple-400",
      }}
    />
  );
};

export default FearBar;