"use client";

import { Plus, Minus } from "lucide-react";

interface StatBarProps {
  label: string;
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
  readonly?: boolean;
  barColor?: {
    filled: string;
    empty: string;
    border: string;
  };
}

const StatBar = ({
  label,
  value,
  maxValue,
  onValueChange,
  disabled = false,
  readonly = false,
  barColor = {
    filled: "border-sky-400 bg-sky-500",
    empty: "border-slate-600 bg-transparent",
    border: "hover:border-sky-400",
  },
}: StatBarProps) => {
  const handleClick = (index: number, isRightClick: boolean) => {
    if (disabled || readonly) return;

    const newValue = isRightClick
      ? Math.max(0, index) // Right click: set to index (effectively decreasing)
      : Math.min(maxValue, index + 1); // Left click: set to index + 1 (effectively increasing)

    onValueChange(newValue);
  };

  const handleRightClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    handleClick(index, true);
  };

  const handleIncrement = () => {
    if (disabled || readonly || value >= maxValue) return;
    onValueChange(value + 1);
  };

  const handleDecrement = () => {
    if (disabled || readonly || value <= 0) return;
    onValueChange(value - 1);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-sm font-medium text-slate-300">{label}</span>
      {!disabled && !readonly && (
        <button
          onClick={handleDecrement}
          disabled={value <= 0}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-600 text-white transition-colors hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50 lg:h-5 lg:w-5"
          title={`Decrease ${label}`}
        >
          <Minus className="h-3 w-3 lg:h-2.5 lg:w-2.5" />
        </button>
      )}
      {disabled && (
        <button
          onClick={handleDecrement}
          disabled={true}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-600 text-white transition-colors hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50 lg:h-5 lg:w-5"
          title={`Decrease ${label}`}
        >
          <Minus className="h-3 w-3 lg:h-2.5 lg:w-2.5" />
        </button>
      )}
      <div className="flex gap-1 lg:gap-0.5">
        {Array.from({ length: maxValue }, (_, index) => {
          if (readonly) {
            // Readonly: render as div with normal colors
            return (
              <div
                key={index}
                className={`h-6 w-6 border-2 transition-colors duration-150 lg:h-5 lg:w-5 ${
                  index < value ? barColor.filled : barColor.empty
                }`}
                title={`${label}: ${index + 1}/${maxValue}`}
              />
            );
          } else {
            // Interactive or disabled: render as button
            return (
              <button
                key={index}
                className={`h-6 w-6 border-2 transition-colors duration-150 lg:h-5 lg:w-5 ${
                  index < value ? barColor.filled : barColor.empty
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : `cursor-pointer ${barColor.border}`
                }`}
                onClick={() => handleClick(index, false)}
                onContextMenu={(e) => handleRightClick(e, index)}
                disabled={disabled}
                title={
                  disabled
                    ? `${label}: ${index + 1}/${maxValue}`
                    : `${label}: ${index + 1}/${maxValue}. Left click to increase, right click to decrease.`
                }
              />
            );
          }
        })}
      </div>
      {!disabled && !readonly && (
        <button
          onClick={handleIncrement}
          disabled={value >= maxValue}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-600 text-white transition-colors hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50 lg:h-5 lg:w-5"
          title={`Increase ${label}`}
        >
          <Plus className="h-3 w-3 lg:h-2.5 lg:w-2.5" />
        </button>
      )}
      {disabled && (
        <button
          onClick={handleIncrement}
          disabled={true}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-600 text-white transition-colors hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50 lg:h-5 lg:w-5"
          title={`Increase ${label}`}
        >
          <Plus className="h-3 w-3 lg:h-2.5 lg:w-2.5" />
        </button>
      )}
    </div>
  );
};

export default StatBar;
