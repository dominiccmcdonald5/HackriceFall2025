"use client";

import { useState } from "react";
import GlobeClient from "@/components/globeClient";
import type { MyMarker } from "@/components/ui/globe";

export default function Home() {
  const [dataHeader, setDataHeader] = useState("Data Resources");
  const [dataResources, setDataResources] = useState([
    { id: 1, name: "Data Analytics", value: "42.5B", growth: "+3.2%" },
    { id: 2, name: "Locomex", value: "18.3B", growth: "+1.7%" },
    { id: 3, name: "Market Insights", value: "7.8B", growth: "+2.4%" },
    { id: 4, name: "Tech Solutions", value: "12.1B", growth: "+4.0%" },
    { id: 5, name: "Green Energy", value: "9.6B", growth: "+5.2%" },
  ]);

  const handleMarkerClick = (marker: MyMarker) => {
    switch (marker.country) {
      case "United States":
        setDataHeader("United States Data");
        setDataResources([
          { id: 1, name: "GDP", value: "25.3T", growth: "+2.1%" },
          { id: 2, name: "Population", value: "331M", growth: "+0.5%" },
          { id: 3, name: "Tech Sector", value: "1.9T", growth: "+6.3%" },
        ]);
        break;
      case "China":
        setDataHeader("China Data");
        setDataResources([
          { id: 1, name: "GDP", value: "17.7T", growth: "+4.8%" },
          { id: 2, name: "Population", value: "1.4B", growth: "+0.2%" },
          { id: 3, name: "Manufacturing", value: "5.1T", growth: "+5.9%" },
        ]);
        break;
      case "India":
        setDataHeader("India Data");
        setDataResources([
          { id: 1, name: "GDP", value: "3.7T", growth: "+6.5%" },
          { id: 2, name: "Population", value: "1.42B", growth: "+0.8%" },
          { id: 3, name: "IT Services", value: "250B", growth: "+7.1%" },
        ]);
        break;
      case "South Africa":
        setDataHeader("South Africa Data");
        setDataResources([
          { id: 1, name: "GDP", value: "419B", growth: "+1.9%" },
          { id: 2, name: "Population", value: "60M", growth: "+1.2%" },
          { id: 3, name: "Mining Sector", value: "70B", growth: "+3.5%" },
        ]);
        break;
      default:
        setDataHeader("No Data");
        setDataResources([]);
    }
  };

  return (
    <div className="font-sans h-screen flex flex-col bg-gradient-to-b from-[#447604] to-[#243025] text-white p-4 sm:p-8 overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-8 flex-grow h-full">
        {/* Left panel - Globe */}
        <div className="lg:w-2/5 h-full flex items-center justify-start">
          <div className="w-full h-full max-h-[center] flex items-center justify-center lg:justify-start max-w-[100px]">
            <div className="w-full h-full">
              <GlobeClient onMarkerClick={handleMarkerClick} />
            </div>
          </div>
        </div>

        {/* Right panel - Data */}
        <div className="lg:w-3/5 flex flex-col gap-6 h-full">
          <div className="bg-white/10 rounded-xl p-4 flex-grow overflow-y-auto">
            <h2 className="text-xl font-semibold mb-3">{dataHeader}</h2>
            <div className="space-y-3">
              {dataResources.map((item) => (
                <div key={item.id} className="bg-black/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{item.name}</h3>
                    <span className="text-green-300">{item.growth}</span>
                  </div>
                  <p className="text-2xl font-bold mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}