"use client";

import { cn } from "@/lib/utils";

interface WeatherIconProps {
  condition: string | { text?: string; icon?: string };
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  animated?: boolean;
}

const iconPaths: Record<string, { path: string; secondary?: string }> = {
  sunny: {
    path: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  },
  "partly-cloudy": {
    path: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    secondary: "M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25",
  },
  cloudy: {
    path: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  },
  rain: {
    path: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15zm5 6a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z",
  },
  "heavy-rain": {
    path: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15zm6 6a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z",
  },
  thunderstorm: {
    path: "M13 10V3L4 14h7v7l9-11h-7z",
    secondary: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  },
  snow: {
    path: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15zm4 6a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm-8 4a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z",
  },
  fog: {
    path: "M3 12h18M3 16h18M3 8h18",
  },
  moon: {
    path: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  },
  "night-cloudy": {
    path: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    secondary: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  },
};

const sizeConfig = {
  xs: { outer: "w-4 h-4", stroke: 2 },
  sm: { outer: "w-6 h-6", stroke: 1.75 },
  md: { outer: "w-8 h-8", stroke: 1.5 },
  lg: { outer: "w-10 h-10", stroke: 1.5 },
  xl: { outer: "w-14 h-14", stroke: 1.25 },
  hero: { outer: "w-36 h-36", stroke: 0.75 },
};

export function WeatherIcon({
  condition,
  size = "lg",
  className,
  animated = true,
}: WeatherIconProps) {
  const conditionText = typeof condition === "string" ? condition : (condition.icon || "sunny");
  const iconKey = conditionText.toLowerCase().replace(/\s+/g, "-").replace("_", "-");
  const icon = iconPaths[iconKey] || iconPaths.sunny;
  const config = sizeConfig[size];

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        className={cn(
          config.outer,
          "text-current",
          animated && "animate-pulse-subtle"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={config.stroke}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={icon.path}
        />
      </svg>
      {icon.secondary && (
        <svg
          className={cn(
            config.outer,
            "absolute text-current/30"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={config.stroke}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={icon.secondary}
          />
        </svg>
      )}
    </div>
  );
}
