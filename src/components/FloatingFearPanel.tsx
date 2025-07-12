"use client";

interface FloatingFearPanelProps {
  value: number;
  maxValue: number;
}

const FloatingFearPanel = ({ value, maxValue }: FloatingFearPanelProps) => {
  return (
    <div className="fixed right-4 bottom-16 z-50 rounded-lg border border-slate-700 bg-slate-800/95 p-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-red-500 uppercase">Fear</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxValue }, (_, index) => (
            <div
              key={index}
              className={`h-3 w-3 rotate-45 transform transition-all duration-150 ${
                index < value
                  ? "bg-red-500 shadow-sm shadow-red-500/50"
                  : "border border-slate-600 bg-transparent"
              }`}
              title={`Fear: ${value}/${maxValue}`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-400">
          {value}/{maxValue}
        </span>
      </div>
    </div>
  );
};

export default FloatingFearPanel;
