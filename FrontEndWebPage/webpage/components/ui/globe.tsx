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
      { lat: -14.2350, lng: -51.9253, country: "Brazil" },
      { lat: 55.3781, lng: -3.4360, country: "United Kingdom" },
      { lat: 56.1304, lng: -106.3468, country: "Canada" },
      { lat: 20.5937, lng: 78.9629, country: "Pakistan" },
      { lat: 36.2048, lng: 138.2529, country: "Japan" },
      { lat: 51.1657, lng: 10.4515, country: "Germany" },
      { lat: 46.6034, lng: 1.8883, country: "France" },
      { lat: -33.8688, lng: 151.2093, country: "Australia" },
      { lat: 40.4637, lng: -3.7492, country: "Spain" },
      { lat: 41.8719, lng: 12.5674, country: "Italy" },
      { lat: 23.4241, lng: 53.8478, country: "United Arab Emirates" },
      { lat: 24.7136, lng: 46.6753, country: "Saudi Arabia" },
      { lat: -9.19, lng: -75.0152, country: "Peru" },
      { lat: -1.8312, lng: -78.1834, country: "Ecuador" },
      { lat: 25.276987, lng: 55.296249, country: "Qatar" },
      { lat: 39.0742, lng: 21.8243, country: "Greece" },
      { lat: 15.8700, lng: 100.9925, country: "Thailand" },
      { lat: 4.2105, lng: 101.9758, country: "Malaysia" }
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
