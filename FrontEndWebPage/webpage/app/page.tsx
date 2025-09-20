"use client";
import React, { useState } from 'react';
import GlobeClient from "@/components/globeClient";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const sampleData = [
    { id: 1, name: 'Data Analytics', value: '42.5B', growth: '+3.2%' },
    { id: 2, name: 'Locomex', value: '18.3B', growth: '+1.7%' },
    { id: 3, name: 'Market Insights', value: '7.8B', growth: '+2.4%' },
    { id: 4, name: 'Tech Solutions', value: '12.1B', growth: '+4.0%' },
    { id: 5, name: 'Green Energy', value: '9.6B', growth: '+5.2%' },
  ];

  return (
    <div className="font-sans h-screen flex flex-col bg-gradient-to-b from-[#447604] to-[#243025] text-white p-4 sm:p-8 overflow-hidden">

      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-8 flex-grow h-full">
        
        {/* Left panel - Globe */}
        <div className="lg:w-2/5 h-full flex items-center justify-center">
          <div className="w-full h-full max-h-[90%]">
            <GlobeClient />
          </div>
        </div>

        {/* Right panel - Title and Data */}
        <div className="lg:w-3/5 flex flex-col gap-6 h-full">
          
          {/* Title / Info Section */}
          <div className="bg-white/10 rounded-xl p-4 flex-shrink-0">
            <h2 className="text-xl font-semibold mb-2">World Wide Resources!</h2>
            <p className="text-sm text-gray-200">
              Explore key industry data and market insights from around the globe. Click on a country in the globe to see detailed statistics.
            </p>
          </div>

          {/* Data cards */}
          <div className="bg-white/10 rounded-xl p-4 flex-grow overflow-y-auto">
            <h2 className="text-xl font-semibold mb-3">Data Resources</h2>
            <div className="space-y-3">
              {sampleData.map((item) => (
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

          {/* Selected country info */}
          {selectedCountry && (
            <div className="bg-white/10 rounded-xl p-4 flex-shrink-0">
              <h2 className="text-xl font-semibold mb-3">Selected Country</h2>
              <p className="text-lg">{selectedCountry}</p>
              <button 
                className="mt-3 text-sm text-green-300 hover:text-green-200"
                onClick={() => setSelectedCountry(null)}
              >
                Clear Selection
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
