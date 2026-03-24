"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useWeatherStore } from "@/stores/weatherStore";
import { Search } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapCenterUpdater() {
  const map = useMap();
  const { currentLocation } = useWeatherStore();

  useEffect(() => {
    if (currentLocation) {
      map.setView([currentLocation.lat, currentLocation.lon], 10, {
        animate: true,
      });
    }
  }, [currentLocation, map]);

  return null;
}

function CurrentLocationMarker() {
  const { currentLocation, weatherData } = useWeatherStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !currentLocation) return null;

  const temp = weatherData.current?.current.tempC ?? 0;
  const condition = weatherData.current?.current.condition.text ?? "Clear";

  return (
    <Marker position={[currentLocation.lat, currentLocation.lon]}>
      <Popup>
        <div className="text-center p-2 min-w-[120px]">
          <p className="font-bold text-lg">{Math.round(temp)}°C</p>
          <p className="text-sm text-gray-600">{condition}</p>
          <p className="text-xs text-gray-500 mt-1">{currentLocation.name}</p>
        </div>
      </Popup>
    </Marker>
  );
}

export function WeatherMap() {
  const { currentLocation } = useWeatherStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultCenter: [number, number] = currentLocation
    ? [currentLocation.lat, currentLocation.lon]
    : [40.7128, -74.006];

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[400px] bg-[#1a1a2e] rounded-2xl flex items-center justify-center">
        <div className="text-white/50">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/[0.08]">
      <MapContainer
        center={defaultCenter}
        zoom={10}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapCenterUpdater />
        <CurrentLocationMarker />
      </MapContainer>
    </div>
  );
}
