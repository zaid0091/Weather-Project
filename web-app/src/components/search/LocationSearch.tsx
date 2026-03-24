"use client";

import { useState, useEffect, useRef } from "react";
import { searchLocations } from "@/services/weatherService";
import { useWeatherStore } from "@/stores/weatherStore";
import { debounce } from "@/lib/utils";
import { Search, MapPin, X, Globe } from "lucide-react";
import type { SearchResult } from "@/types/weather";

interface LocationSearchProps {
  onClose?: () => void;
}

export function LocationSearch({ onClose }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addSavedLocation, setCurrentLocation } = useWeatherStore();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        const locations = await searchLocations(searchQuery);
        setResults(locations);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setLoading(true);
    setSelectedIndex(-1);
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      selectLocation(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose?.();
    }
  };

  const selectLocation = (location: SearchResult) => {
    const savedLocation = {
      id: location.id,
      name: location.name,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
      countryCode: location.countryCode,
      isHome: false,
      order: 0,
    };

    addSavedLocation(savedLocation);
    setCurrentLocation(savedLocation);
    setQuery("");
    setResults([]);
    onClose?.();
  };

  const getCountryFlag = (code: string) => {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? "scale-[1.02]" : ""
        }`}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search
            size={20}
            className={`transition-colors duration-200 ${
              isFocused ? "text-purple-400" : "text-white/40"
            }`}
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for any city..."
          className="w-full pl-12 pr-12 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder-white/30 text-base focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 transition-all duration-200"
          >
            <X size={16} />
          </button>
        )}
        <div
          className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl transition-opacity duration-300 ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {loading && (
        <div className="absolute top-full left-0 right-0 mt-3 py-4 px-5 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-white/60 text-sm">Searching...</span>
          </div>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => selectLocation(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-150 border-b border-white/[0.05] last:border-0 ${
                index === selectedIndex
                  ? "bg-gradient-to-r from-purple-500/20 to-transparent"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Globe size={18} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white truncate">
                    {result.name}
                  </span>
                  <span className="text-lg">{getCountryFlag(result.countryCode)}</span>
                </div>
                <div className="text-sm text-white/50 truncate flex items-center gap-1.5">
                  <MapPin size={12} />
                  {result.region && `${result.region}, `}
                  {result.country}
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                index === selectedIndex
                  ? "border-purple-500 bg-purple-500/20"
                  : "border-white/20"
              }`}>
                {index === selectedIndex && (
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-3 py-8 px-6 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <MapPin size={28} className="text-white/30" />
          </div>
          <p className="text-white/80 font-medium">No cities found</p>
          <p className="text-sm text-white/40 mt-1.5">
            Try searching for a different city name
          </p>
        </div>
      )}
    </div>
  );
}
