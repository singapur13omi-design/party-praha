"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface PartyMapItem {
  id: string;
  name: string;
  type: string;
  music: string;
  location: string;
  latitude: number;
  longitude: number;
  startTime: string;
  date: string;
}

interface MapProps {
  parties: PartyMapItem[];
  selectedPartyId?: string | null;
  onSelectParty: (partyId: string) => void;
}

export default function PartyMap({ parties, selectedPartyId, onSelectParty }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered in Prague
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([50.0825, 14.4255], 13);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Dark futuristic Map Tiles (CartoDB Dark Matter)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    // Add markers for parties
    parties.forEach((party) => {
      const isSelected = party.id === selectedPartyId;

      // Custom pulsing neon marker icon
      const customIcon = L.divIcon({
        className: "custom-neon-marker",
        html: `
          <div style="
            width: ${isSelected ? "32px" : "24px"};
            height: ${isSelected ? "32px" : "24px"};
            background: ${isSelected ? "#ff007f" : "#00f0ff"};
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 0 ${isSelected ? "18px #ff007f" : "12px #00f0ff"};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            <div style="width: 6px; height: 6px; background: #ffffff; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
        iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
      });

      const marker = L.marker([party.latitude, party.longitude], { icon: customIcon })
        .addTo(map)
        .on("click", () => {
          onSelectParty(party.id);
        });

      markersRef.current[party.id] = marker;
    });

    // If a party is selected, fly to it
    if (selectedPartyId && markersRef.current[selectedPartyId]) {
      const selected = parties.find((p) => p.id === selectedPartyId);
      if (selected) {
        map.flyTo([selected.latitude, selected.longitude], 15, {
          duration: 0.8,
        });
      }
    }
  }, [parties, selectedPartyId, onSelectParty]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
      <div className="absolute top-3 left-3 z-20 pointer-events-none bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 text-xs font-semibold tracking-wider text-zinc-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        PRAHA LIVE MAP
      </div>
    </div>
  );
}
