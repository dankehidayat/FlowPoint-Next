// src/components/panels/summary/components/ComfortStatus.tsx
"use client";

import { SensorData } from "@/types";
import { Thermometer, Droplets, TrendingUp, TrendingDown } from "lucide-react";

interface ComfortStatusProps {
  data: SensorData;
  overallComfort: any;
  trends: any;
  getComfortIconBg: () => string;
}

export default function ComfortStatus({
  data,
  overallComfort,
  trends,
  getComfortIconBg,
}: ComfortStatusProps) {
  return (
    <div
      className={`rounded-xl p-6 mb-6 border-2 ${overallComfort.border} ${overallComfort.bg} transition-all duration-500`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${getComfortIconBg()}`}>
            {overallComfort.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Comfort Status</h3>
            <p className={`text-2xl font-bold ${overallComfort.color} mb-1`}>
              {overallComfort.level}
            </p>
            <p className="text-gray-600 text-sm max-w-md">
              {overallComfort.recommendation}
            </p>
          </div>
        </div>
        <div className="text-right hidden lg:block">
          <div className="text-sm text-gray-500 mb-2">Current Readings</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 justify-end">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span className="text-gray-900">
                {data.temperature.toFixed(1)}°C
              </span>
              {trends.temp !== "stable" &&
                (trends.temp === "up" ? (
                  <TrendingUp className="w-4 h-4 text-red-500 trend-animation" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-blue-500 trend-animation" />
                ))}
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-gray-900">{data.humidity.toFixed(1)}%</span>
              {trends.humidity !== "stable" &&
                (trends.humidity === "up" ? (
                  <TrendingUp className="w-4 h-4 text-blue-500 trend-animation" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500 trend-animation" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
