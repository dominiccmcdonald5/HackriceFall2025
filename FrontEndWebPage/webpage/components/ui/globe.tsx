"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export interface MyMarker {
  lat: number;
  lng: number;
  country: string;
}

interface GlobeProps {
  onMarkerClick?: (marker: MyMarker) => void;
}

const Globe3D = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function Globe({ onMarkerClick }: GlobeProps) {
  const markers: MyMarker[] = useMemo(
    () => [
      { lat: 37.0904, lng: -95.7128, country: "United States of America" },
      { lat: 35.8617, lng: 104.1954, country: "China" },
      { lat: 19.076, lng: 72.8777, country: "India" },
      { lat: -30.5595, lng: 22.9375, country: "South Africa" },
    ],
    []
  );

  return (
    <div className="w-full h-full">
      <Globe3D
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="rgba(0,0,0,0)"
        pointsData={markers}
        width={450}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "limegreen"}
        pointAltitude={0.02}
        pointRadius={2.5} 
        onPointClick={(marker) => onMarkerClick?.(marker as MyMarker)}
      />
    </div>
  );
}
