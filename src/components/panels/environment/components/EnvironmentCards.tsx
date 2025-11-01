// src/components/panels/environment/components/EnvironmentCards.tsx
"use client";

import { SensorData } from "@/types";
import { Thermometer, Droplets } from "lucide-react";

interface EnvironmentCardsProps {
  data: SensorData;
}

export default function EnvironmentCards({ data }: EnvironmentCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Temperature Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100/80 border border-red-200/50">
              <Thermometer className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-red-600">
                Temperature
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {data.temperature.toFixed(1)}
                <span className="text-sm font-normal ml-0.5">°C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Humidity Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100/80 border border-blue-200/50">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-blue-600">Humidity</div>
              <div className="text-2xl font-bold text-gray-900">
                {data.humidity.toFixed(1)}
                <span className="text-sm font-normal ml-0.5">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
