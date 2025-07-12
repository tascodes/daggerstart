"use client";

import { Plus, Minus } from "lucide-react";

interface FloatingHopePanelProps {
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
}

const FloatingHopePanel = ({
  value,
  maxValue,
  onValueChange,
  disabled = false,
}: FloatingHopePanelProps) => {
  const handleIncrement = () => {
    if (disabled || value >= maxValue) return;
    onValueChange(value + 1);
  };

  const handleDecrement = () => {
    if (disabled || value <= 0) return;
    onValueChange(value - 1);
  };

  const handleClick = (index: number) => {
    if (disabled) return;
    onValueChange(index + 1);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 rounded-lg border border-slate-700 bg-slate-800/95 p-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-yellow-500 uppercase">
          Hope
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDecrement}
            disabled={disabled || value <= 0}
            className="flex h-4 w-4 items-center justify-center rounded bg-slate-700 text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Decrease Hope"
          >
            <Minus className="h-2.5 w-2.5" />
          </button>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: maxValue }, (_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rotate-45 transform transition-all duration-150 ${
                  index < value
                    ? "bg-yellow-400 shadow-sm shadow-yellow-400/50"
                    : "border border-slate-600 bg-transparent"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:scale-110"
                }`}
                onClick={() => handleClick(index)}
                disabled={disabled}
                title={`Hope: ${index + 1}/${maxValue}`}
              />
            ))}
          </div>
          <button
            onClick={handleIncrement}
            disabled={disabled || value >= maxValue}
            className="flex h-4 w-4 items-center justify-center rounded bg-slate-700 text-white transition-colors hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Increase Hope"
          >
            <Plus className="h-2.5 w-2.5" />
          </button>
        </div>
        <span className="text-xs text-slate-400">
          {value}/{maxValue}
        </span>
      </div>
    </div>
  );
};

export default FloatingHopePanel;
