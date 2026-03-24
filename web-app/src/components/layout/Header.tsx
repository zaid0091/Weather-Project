"use client";

import { useState } from "react";
import { useWeatherStore } from "@/stores/weatherStore";
import { LocationSearch } from "@/components/search/LocationSearch";
import { Settings, Search, MapPin, X } from "lucide-react";

interface HeaderProps {
  onOpenSettings?: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const { currentLocation } = useWeatherStore();

  return (
    <header className="sticky top-0 z-50 safe-area-top">
      <div className="px-5 pt-5 pb-4">
        {showSearch ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <LocationSearch onClose={() => setShowSearch(false)} />
              </div>
              <button
                onClick={() => setShowSearch(false)}
                className="icon-btn"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-3 group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center group-hover:border-purple-500/40 transition-all">
                <MapPin size={18} className="text-purple-400" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">
                  {currentLocation?.name || "Select Location"}
                </div>
                {currentLocation?.country && (
                  <div className="text-xs text-muted">
                    {currentLocation.country}
                  </div>
                )}
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSearch(true)}
                className="icon-btn"
              >
                <Search size={18} />
              </button>
              <button
                onClick={onOpenSettings}
                className="icon-btn"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
