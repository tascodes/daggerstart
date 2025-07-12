"use client";

import { useState, useEffect, useRef } from "react";

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

interface FloatingFearPanelProps {
  value: number;
  maxValue: number;
}

const FloatingFearPanel = ({ value, maxValue }: FloatingFearPanelProps) => {
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

  const getAnimationClasses = () => {
    if (!isAnimating) return "";

    if (animationType === "increase") {
      if (reducedMotion) {
        return "shadow-2xl shadow-red-500/60 ring-4 ring-red-500/50 brightness-110";
      } else {
        return "shadow-2xl shadow-red-500/60 ring-4 ring-red-500/50 scale-105 brightness-110";
      }
    } else {
      return "shadow-lg shadow-purple-400/30 ring-2 ring-purple-400/40";
    }
  };

  return (
    <div
      className={`fixed right-4 bottom-16 z-50 rounded-lg border border-slate-700 bg-slate-800/95 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 ${getAnimationClasses()}`}
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
          isAnimating && animationType === "increase" ? "fear-increase" : ""
        }
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-purple-500 uppercase">
            Fear
          </span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: maxValue }, (_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rotate-45 transform transition-all duration-150 ${
                  index < value
                    ? isAnimating && animationType === "increase"
                      ? "bg-red-500 shadow-lg shadow-red-500/50"
                      : "bg-purple-500 shadow-sm shadow-purple-500/50"
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
      {isAnimating && (
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

export default FloatingFearPanel;
