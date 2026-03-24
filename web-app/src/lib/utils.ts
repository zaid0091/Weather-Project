import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTemperature(
  temp: number,
  unit: "celsius" | "fahrenheit"
): string {
  const rounded = Math.round(temp);
  return `${rounded}°${unit === "celsius" ? "C" : "F"}`;
}

export function formatWindSpeed(
  speed: number,
  unit: "kph" | "mph" | "ms" | "knots"
): string {
  const conversions: Record<string, (s: number) => number> = {
    kph: (s) => s,
    mph: (s) => s * 0.621371,
    ms: (s) => s / 3.6,
    knots: (s) => s * 0.539957,
  };
  const converted = conversions[unit](speed);
  return `${Math.round(converted)} ${unit}`;
}

export function formatPressure(
  pressure: number,
  unit: "hPa" | "inHg" | "mb"
): string {
  const conversions: Record<string, (p: number) => number> = {
    hPa: (p) => p,
    mb: (p) => p,
    inHg: (p) => p * 0.02953,
  };
  const converted = conversions[unit](pressure);
  return `${converted.toFixed(unit === "inHg" ? 2 : 0)} ${unit}`;
}

export function formatPrecipitation(
  amount: number,
  unit: "mm" | "in"
): string {
  const converted = unit === "in" ? amount * 0.03937 : amount;
  return `${converted.toFixed(1)} ${unit}`;
}

export function formatVisibility(
  distance: number,
  unit: "km" | "mi"
): string {
  const converted = unit === "mi" ? distance * 0.621371 : distance;
  return `${converted.toFixed(1)} ${unit}`;
}

export function getWindDirection(degree: number): string {
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
}

export function getUVIndexLevel(uv: number): {
  label: string;
  color: string;
  advice: string;
} {
  if (uv <= 2) {
    return { label: "Low", color: "text-success", advice: "No protection needed" };
  } else if (uv <= 5) {
    return { label: "Moderate", color: "text-yellow-500", advice: "Wear sunscreen" };
  } else if (uv <= 7) {
    return { label: "High", color: "text-warning", advice: "Reduce sun exposure" };
  } else if (uv <= 10) {
    return { label: "Very High", color: "text-orange-500", advice: "Extra protection needed" };
  } else {
    return { label: "Extreme", color: "text-danger", advice: "Avoid sun exposure" };
  }
}

export function getAQICategory(aqi: number): {
  label: string;
  color: string;
  advice: string;
} {
  if (aqi <= 50) {
    return { label: "Good", color: "text-success", advice: "Air quality is satisfactory" };
  } else if (aqi <= 100) {
    return { label: "Moderate", color: "text-yellow-500", advice: "Sensitive individuals should limit outdoor exertion" };
  } else if (aqi <= 150) {
    return { label: "Unhealthy for Sensitive Groups", color: "text-orange-500", advice: "Sensitive groups should reduce prolonged outdoor exertion" };
  } else if (aqi <= 200) {
    return { label: "Unhealthy", color: "text-danger", advice: "Everyone may begin to experience health effects" };
  } else if (aqi <= 300) {
    return { label: "Very Unhealthy", color: "text-purple-600", advice: "Health warnings of emergency conditions" };
  } else {
    return { label: "Hazardous", color: "text-red-900", advice: "Health emergency warning" };
  }
}

export function getMoonPhase(illumination: number, isWaxing: boolean): string {
  if (illumination < 3) return "New Moon";
  if (illumination < 46) return isWaxing ? "Waxing Crescent" : "Waning Crescent";
  if (illumination < 54) return isWaxing ? "First Quarter" : "Last Quarter";
  if (illumination < 96) return isWaxing ? "Waxing Gibbous" : "Waning Gibbous";
  return "Full Moon";
}

export function getWeatherTheme(condition: string, isDay: boolean): {
  bg: string;
  textColor: string;
  icon: string;
} {
  const conditionLower = condition.toLowerCase();

  if (!isDay) {
    if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
      return { bg: "bg-weather-night", textColor: "text-white", icon: "moon" };
    }
    return { bg: "bg-weather-night", textColor: "text-white", icon: "night-cloudy" };
  }

  if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return { bg: "bg-weather-stormy", textColor: "text-white", icon: "thunderstorm" };
  }
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return { bg: "bg-weather-rainy", textColor: "text-white", icon: "rain" };
  }
  if (conditionLower.includes("snow") || conditionLower.includes("sleet") || conditionLower.includes("ice")) {
    return { bg: "bg-weather-snowy", textColor: "text-primary-800", icon: "snow" };
  }
  if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return { bg: "bg-weather-foggy", textColor: "text-gray-700", icon: "fog" };
  }
  if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    return { bg: "bg-weather-cloudy", textColor: "text-white", icon: "cloudy" };
  }
  return { bg: "bg-weather-sunny", textColor: "text-primary-800", icon: "sunny" };
}

export function formatTime(time: string, format: "12h" | "24h"): string {
  const [hours, minutes] = time.split(":").map(Number);
  if (format === "24h") return time;

  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getDayName(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
