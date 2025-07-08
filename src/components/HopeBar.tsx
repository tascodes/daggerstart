"use client";

import { Plus, Minus } from "lucide-react";
type ClassKeys =
  | "warrior"
  | "bard"
  | "wizard"
  | "druid"
  | "guardian"
  | "rogue"
  | "seraph"
  | "sorcerer"
  | "ranger";

const hopeFeatures = {
  warrior:
    "<b>No Mercy: Spend 3 Hope</b> to gain a +1 bonus to your attack rolls until your next rest.",
  bard: "<b>Make a Scene: Spend 3 Hope</b> to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.",
  wizard:
    "<b>Not This Time: Spend 3 Hope</b> to force an adversary within Far range to reroll an attack or damage roll.",
  druid:
    "<b>Evolution: Spend 3 Hope</b> to transform into a Beastform without marking a Stress. When you do, choose one trait to raise by +1 until you drop out of that Beastform.",
  guardian: "<b>Frontline Tank: Spend 3 Hope</b> to clear 2 Armor Slots.",
  rogue:
    "<b>Rogue&apos;s Dodge: Spend 3 Hope</b> to gain a +2 bonus to your Evasion until the next time an attack succeeds against you. Otherwise, this bonus lasts until your next rest.",
  seraph:
    "<b>Life Support: Spend 3 Hope</b> to clear a Hit Point on an ally within Close range.",
  sorcerer:
    "<b>Volatile Magic: Spend 3 Hope</b> to reroll any number of your damage dice on an attack that deals magic damage.",
  ranger:
    "<b>Hold Them Off: Spend 3 Hope</b> when you succeed on an attack with a weapon to use that same roll against two additional adversaries within range of the attack.",
};

interface HopeBarProps {
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
  _class?: string;
}

const HopeBar = ({
  value,
  maxValue,
  onValueChange,
  disabled = false,
  _class,
}: HopeBarProps) => {
  const handleClick = (index: number, isRightClick: boolean) => {
    if (disabled) return;

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
    if (disabled || value >= maxValue) return;
    onValueChange(value + 1);
  };

  const handleDecrement = () => {
    if (disabled || value <= 0) return;
    onValueChange(value - 1);
  };

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-4">
        <div className="clip-path-arrow bg-slate-600 px-4 py-2 text-lg font-bold text-white">
          HOPE
        </div>
      </div>
      <p className="mb-4 text-sm text-slate-400">
        Spend a Hope to use an experience or help an ally.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDecrement}
          disabled={disabled || value <= 0}
          className="flex items-center justify-center rounded bg-slate-600 text-white transition-colors hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            width: "20px",
            height: "20px",
            minWidth: "20px",
            flexShrink: 0,
          }}
          title="Decrease Hope"
        >
          <Minus className="h-2.5 w-2.5" />
        </button>
        <div className="flex items-center gap-1 rounded-full bg-slate-600 px-3 py-1.5">
          {Array.from({ length: maxValue }, (_, index) => (
            <div key={index} className="flex items-center">
              <button
                className={`mx-1 h-5 w-5 rotate-45 transform transition-colors duration-150 ${
                  index < value
                    ? "bg-yellow-400"
                    : "border-2 border-slate-400 bg-transparent"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-yellow-300"
                }`}
                onClick={() => handleClick(index, false)}
                onContextMenu={(e) => handleRightClick(e, index)}
                disabled={disabled}
                title={`Hope: ${index + 1}/${maxValue}. Left click to increase, right click to decrease.`}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleIncrement}
          disabled={disabled || value >= maxValue}
          className="flex items-center justify-center rounded bg-slate-600 text-white transition-colors hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            width: "20px",
            height: "20px",
            minWidth: "20px",
            flexShrink: 0,
          }}
          title="Increase Hope"
        >
          <Plus className="h-2.5 w-2.5" />
        </button>
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs text-slate-400">
          {value}/{maxValue}
        </span>
      </div>
      {!!_class && _class in hopeFeatures && (
        <div
          className="text-sm text-white"
          dangerouslySetInnerHTML={{
            __html: hopeFeatures[_class as keyof typeof hopeFeatures],
          }}
        ></div>
      )}
    </div>
  );
};

export default HopeBar;
