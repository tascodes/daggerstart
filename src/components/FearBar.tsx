"use client";

import { useState, useEffect, useRef } from "react";
import StatBar from "./StatBar";

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

interface FearBarProps {
  value: number;
  maxValue: number;
  onValueChange: (newValue: number) => void;
  disabled?: boolean;
  readonly?: boolean;
}

const FearBar = ({
  value,
  maxValue,
  onValueChange,
  disabled = false,
  readonly = false,
}: FearBarProps) => {
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
    }, 500); // Small delay to let component settle

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (readonly && canAnimate && value !== prevValueRef.current) {
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
  }, [value, readonly, canAnimate]);

  const getAnimationClasses = () => {
    if (!readonly || !isAnimating) return "";

    if (animationType === "increase") {
      if (reducedMotion) {
        // Reduced motion: only color/glow changes, no scaling or movement
        return "shadow-2xl shadow-red-500/60 ring-4 ring-red-500/50 brightness-110";
      } else {
        // Full animation: include scaling for dramatic effect
        return "shadow-2xl shadow-red-500/60 ring-4 ring-red-500/50 scale-105 brightness-110";
      }
    } else {
      return "shadow-lg shadow-purple-400/30 ring-2 ring-purple-400/40";
    }
  };

  return (
    <div
      className={`relative transition-all duration-300 ${getAnimationClasses()}`}
    >
      <style jsx>{`
        @keyframes fearShake {
          0%,
          100% {
            transform: translateX(0) scale(1);
          }
          10% {
            transform: translateX(-2px) scale(1.02);
          }
          20% {
            transform: translateX(2px) scale(1.04);
          }
          30% {
            transform: translateX(-3px) scale(1.02);
          }
          40% {
            transform: translateX(3px) scale(1.03);
          }
          50% {
            transform: translateX(-2px) scale(1.05);
          }
          60% {
            transform: translateX(2px) scale(1.03);
          }
          70% {
            transform: translateX(-1px) scale(1.02);
          }
          80% {
            transform: translateX(1px) scale(1.01);
          }
          90% {
            transform: translateX(0) scale(1.01);
          }
        }

        @keyframes fearShakeReduced {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }

        .fear-increase {
          animation: ${reducedMotion ? "fearShakeReduced" : "fearShake"} 0.6s
            ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .fear-increase {
            animation: fearShakeReduced 0.6s ease-in-out;
          }
        }
      `}</style>
      <div
        className={
          readonly && isAnimating && animationType === "increase"
            ? "fear-increase"
            : ""
        }
      >
        <StatBar
          label="FEAR"
          value={value}
          maxValue={maxValue}
          onValueChange={onValueChange}
          disabled={disabled}
          readonly={readonly}
          barColor={{
            filled:
              readonly && isAnimating && animationType === "increase"
                ? "border-red-400 bg-red-500 shadow-lg shadow-red-500/50"
                : "border-purple-400 bg-purple-500",
            empty: "border-slate-600 bg-transparent",
            border: "hover:border-purple-400",
          }}
        />
      </div>
      {readonly && isAnimating && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded">
          {animationType === "increase" && (
            <>
              {!reducedMotion && (
                <div className="absolute inset-0 animate-ping rounded border-3 border-red-500/60"></div>
              )}
              <div
                className={`absolute inset-0 rounded bg-red-500/15 ${!reducedMotion ? "animate-pulse" : ""}`}
              ></div>
              {!reducedMotion && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20"></div>
              )}
            </>
          )}
          {animationType === "decrease" && (
            <div className="absolute inset-0 rounded bg-purple-500/10"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default FearBar;
