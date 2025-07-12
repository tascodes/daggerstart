"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Minus } from "lucide-react";

// Custom hook to detect reduced motion preference
const useReducedMotion = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return reducedMotion;
};

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
  const prevValueRef = useRef(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<
    "increase" | "decrease" | null
  >(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const reducedMotion = useReducedMotion();

  // Allow animations after a short delay to prevent initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanAnimate(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (canAnimate && value !== prevValueRef.current) {
      const isIncreasing = value > prevValueRef.current;
      setAnimationType(isIncreasing ? "increase" : "decrease");
      setIsAnimating(true);

      // Reset animation after it completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setAnimationType(null);
      }, 1000);

      // Update ref after setting up animation
      prevValueRef.current = value;

      return () => clearTimeout(timer);
    } else {
      // Always keep ref in sync when not animating
      prevValueRef.current = value;
    }
  }, [value, canAnimate]);
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

  const getAnimationClasses = () => {
    if (!isAnimating) return "";

    if (animationType === "increase") {
      if (reducedMotion) {
        return "shadow-2xl shadow-yellow-500/60 ring-4 ring-yellow-500/50 brightness-110";
      } else {
        return "shadow-2xl shadow-yellow-500/60 ring-4 ring-yellow-500/50 scale-105 brightness-110";
      }
    } else {
      return "shadow-lg shadow-yellow-400/30 ring-2 ring-yellow-400/40";
    }
  };

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 rounded-lg border border-slate-700 bg-slate-800/95 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 ${getAnimationClasses()}`}
    >
      <style jsx>{`
        @keyframes hopeGlow {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          10% {
            transform: translateY(-1px) scale(1.02);
          }
          20% {
            transform: translateY(-2px) scale(1.04);
          }
          30% {
            transform: translateY(-1px) scale(1.05);
          }
          40% {
            transform: translateY(-2px) scale(1.04);
          }
          50% {
            transform: translateY(-3px) scale(1.06);
          }
          60% {
            transform: translateY(-2px) scale(1.04);
          }
          70% {
            transform: translateY(-1px) scale(1.03);
          }
          80% {
            transform: translateY(-1px) scale(1.02);
          }
          90% {
            transform: translateY(0) scale(1.01);
          }
        }

        @keyframes hopeGlowReduced {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
        }

        .hope-increase {
          animation: ${reducedMotion ? "hopeGlowReduced" : "hopeGlow"} 0.8s
            ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .hope-increase {
            animation: hopeGlowReduced 0.8s ease-out;
          }
        }
      `}</style>
      <div
        className={
          isAnimating && animationType === "increase" ? "hope-increase" : ""
        }
      >
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
                      ? isAnimating && animationType === "increase"
                        ? "bg-yellow-300 shadow-lg shadow-yellow-300/70"
                        : "bg-yellow-400 shadow-sm shadow-yellow-400/50"
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
      {isAnimating && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded">
          {animationType === "increase" && (
            <>
              {!reducedMotion && (
                <div className="absolute inset-0 animate-ping rounded border-3 border-yellow-400/60"></div>
              )}
              <div
                className={`absolute inset-0 rounded bg-yellow-400/15 ${!reducedMotion ? "animate-pulse" : ""}`}
              ></div>
              {!reducedMotion && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20"></div>
              )}
            </>
          )}
          {animationType === "decrease" && (
            <div className="absolute inset-0 rounded bg-yellow-500/10"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingHopePanel;
