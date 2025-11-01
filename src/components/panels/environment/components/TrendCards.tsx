// src/components/panels/environment/components/TrendCards.tsx
"use client";

import { SensorData } from "@/types";
import { TrendingUp, TrendingDown, Thermometer, Droplets } from "lucide-react";
import { useTrendAnalysis } from "../hooks/useTrendAnalysis"; // Named import

interface TrendCardsProps {
  data: SensorData;
}

export default function TrendCards({ data }: TrendCardsProps) {
  const { trendAnalysis, getTrendDescription } = useTrendAnalysis(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Temperature Trend Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
              <Thermometer className="w-4 h-4 text-red-600" />
            </div>
            <span className="font-semibold text-gray-900">
              Temperature Trend
            </span>
          </div>
          {trendAnalysis.temp !== "stable" &&
            (trendAnalysis.temp === "up" ? (
              <TrendingUp className="w-5 h-5 text-red-500 trend-animation" />
            ) : (
              <TrendingDown className="w-5 h-5 text-blue-500 trend-animation" />
            ))}
        </div>
        <p className="text-sm text-gray-600">
          {getTrendDescription("temperature")}
        </p>
      </div>

      {/* Humidity Trend Card */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Humidity Trend</span>
          </div>
          {trendAnalysis.humidity !== "stable" &&
            (trendAnalysis.humidity === "up" ? (
              <TrendingUp className="w-5 h-5 text-blue-500 trend-animation" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-500 trend-animation" />
            ))}
        </div>
        <p className="text-sm text-gray-600">
          {getTrendDescription("humidity")}
        </p>
      </div>
    </div>
  );
}
