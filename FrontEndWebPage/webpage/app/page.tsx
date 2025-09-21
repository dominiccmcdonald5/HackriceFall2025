"use client";

import { useState } from "react";
import GlobeClient from "@/components/globeClient";
import type { MyMarker } from "@/components/ui/globe";

interface FootprintData {
  country: string;
  year: number;
  production: Record<string, number>;
  consumption: Record<string, number>;
  biocapacity: Record<string, number | null>;
  meta: { region: string; income_group: string };
}

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<FootprintData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkerClick = async (marker: MyMarker) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://hackricefall2025.onrender.com/locations/${marker.country}/profile?year=2024`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data: FootprintData = await res.json();
      setSelectedCountry(data);
    } catch (err) {
      console.error(err);
      setError("Could not load data for this country.");
      setSelectedCountry(null);
    } finally {
      setLoading(false);
    }
  };

  const getImportantMetrics = (data: FootprintData) => [
    { label: "Year", value: data.year },
    { label: "Region", value: data.meta.region },
    { label: "Income Group", value: data.meta.income_group },
    { label: "Production Footprint", value: data.production["Total Ecological Footprint (Production)"] },
    { label: "Consumption Footprint", value: data.consumption["Total Ecological Footprint (Consumption)"] },
    { label: "Cropland Footprint", value: data.consumption["Cropland Footprint"] },
    { label: "Forest Footprint", value: data.consumption["Forest Product Footprint"] },
    { label: "Carbon Footprint", value: data.consumption["Carbon Footprint"] },
    { label: "Built-up Land", value: data.consumption["Built up land"] },
    { label: "Biocapacity Total", value: data.biocapacity["Total biocapacity"] ?? "N/A" },
  ];

  const getMetricColor = (label: string, value: unknown): string => {
    if (label === "Biocapacity Total" || label === "Year") return "text-white";
    if (typeof value !== "number") return "text-white"; 

    if (value > 3.0) return "text-red-500";     
    if (value >= 1.0) return "text-yellow-400"; 
    return "text-green-400";                    
  };

  return (
    <div className="font-sans h-screen flex flex-col bg-gradient-to-b from-[#447604] to-[#243025] text-white p-4 sm:p-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-8 flex-grow h-full">
        {/* Left panel - Globe */}
        <div className="lg:w-2/5 h-full flex items-center justify-start">
          <div className="w-4/5 h-full flex items-center justify-center lg:justify-start">
            {typeof window !== "undefined" && (
              <GlobeClient onMarkerClick={handleMarkerClick} />
            )}
          </div>
        </div>

        {/* Right panel - Country Data */}
        <div className="lg:w-3/5 flex flex-col gap-6 h-full">
          <div
            className="bg-white/10 rounded-xl p-4 flex flex-col gap-4 flex-grow overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#22c55e transparent", 
            }}
          >
            {/* Title section */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Global Resource Footprint</h1>
              <p className="text-white/80 mt-1">
                Explore different countries to see how consumption, production, and ecological footprints. See why sustainable resource management is critical for our future.
              </p>
            </div>

            {/* Divider line */}
            <hr className="border-t border-white/30 mb-4" />

            {/* States: loading / error / data */}
            {loading && (
              <div className="text-center text-white/70">Loading data...</div>
            )}
            {error && <div className="text-center text-red-400">{error}</div>}

            {/* Show country data */}
            {selectedCountry && !loading && !error && (
              <>
                <div className="bg-green-600/70 p-4 rounded-xl text-center shadow-lg mb-4">
                  <h2 className="text-3xl font-bold">
                    {selectedCountry.country}
                  </h2>
                  <p className="text-sm mt-1">
                    Environmental Footprint & Biocapacity Overview
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getImportantMetrics(selectedCountry).map((metric, idx) => (
                    <div
                      key={idx}
                      className="bg-black/20 rounded-lg p-3 flex flex-col items-center shadow-md hover:bg-black/30 transition"
                    >
                      <span className="text-white/70 text-sm">
                        {metric.label}
                      </span>
                      <span
                        className={`text-xl font-semibold mt-1 ${getMetricColor(
                          metric.label,
                          metric.value
                        )}`}
                      >
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
