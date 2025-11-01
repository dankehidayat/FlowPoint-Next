// src/components/panels/environment/components/StatsPills.tsx
"use client";

import { SensorData, ChartData, Stats } from "@/types";
import { Thermometer, Droplets } from "lucide-react";
import { useTrendAnalysis } from "../hooks/useTrendAnalysis"; // Named import
import { useCallback } from "react";

interface StatsPillsProps {
  data: SensorData;
  chartData: ChartData[];
}

export default function StatsPills({ data, chartData }: StatsPillsProps) {
  const { trendAnalysis } = useTrendAnalysis(data);

  const calculateStats = useCallback(
    (key: keyof ChartData): Stats => {
      const values = chartData
        .map((d) => {
          const value = d[key] as number;
          return typeof value === "number" && !isNaN(value) ? value : null;
        })
        .filter((v): v is number => v !== null);

      if (values.length === 0) {
        return { min: 0, max: 0, avg: 0, current: 0 };
      }

      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const current = values[values.length - 1] || 0;

      return {
        min: parseFloat(min.toFixed(1)),
        max: parseFloat(max.toFixed(1)),
        avg: parseFloat(avg.toFixed(1)),
        current: parseFloat(current.toFixed(1)),
      };
    },
    [chartData]
  );

  const tempStats = calculateStats("temperature");
  const humidityStats = calculateStats("humidity");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Temperature Pill */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
            <Thermometer className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-red-600">
              {tempStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">°C</span>
            </span>
            {trendAnalysis.temp !== "stable" && (
              <div
                className={`text-xs ${
                  trendAnalysis.temp === "up" ? "text-red-500" : "text-blue-500"
                } trend-animation`}
              >
                {trendAnalysis.temp === "up" ? "↗ Rising" : "↘ Falling"}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <div className="text-gray-500 text-[10px]">Avg</div>
            <div className="font-semibold text-gray-900">
              {tempStats.avg.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-[10px]">Min</div>
            <div className="font-semibold text-gray-900">
              {tempStats.min.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-[10px]">Max</div>
            <div className="font-semibold text-gray-900">
              {tempStats.max.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Humidity Pill */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-blue-600">
              {humidityStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">%</span>
            </span>
            {trendAnalysis.humidity !== "stable" && (
              <div
                className={`text-xs ${
                  trendAnalysis.humidity === "up"
                    ? "text-blue-500"
                    : "text-green-500"
                } trend-animation`}
              >
                {trendAnalysis.humidity === "up" ? "↗ Rising" : "↘ Falling"}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs">
          <div className="text-center">
            <div className="text-gray-500 text-[10px]">Avg</div>
            <div className="font-semibold text-gray-900">
              {humidityStats.avg.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-[10px]">Min</div>
            <div className="font-semibold text-gray-900">
              {humidityStats.min.toFixed(1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-500 text-[10px]">Max</div>
            <div className="font-semibold text-gray-900">
              {humidityStats.max.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
