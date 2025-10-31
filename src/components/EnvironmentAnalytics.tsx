// src/components/EnvironmentAnalytics.tsx
"use client";

import { ChartData, SensorData, Stats } from "@/types";
import { useCallback } from "react";
import EnvironmentChart from "./charts/EnvironmentChart";
import { Thermometer, Droplets } from "lucide-react";

interface EnvironmentAnalyticsProps {
  data: SensorData;
  chartData: ChartData[];
}

export default function EnvironmentAnalytics({
  data,
  chartData,
}: EnvironmentAnalyticsProps) {
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

  // Get comfort levels
  const getTemperatureLevel = (temp: number) => {
    if (temp < 18)
      return {
        text: "Cool",
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950",
        border: "border-blue-200 dark:border-blue-800",
      };
    if (temp < 26)
      return {
        text: "Ideal",
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-950",
        border: "border-green-200 dark:border-green-800",
      };
    return {
      text: "Warm",
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950",
      border: "border-red-200 dark:border-red-800",
    };
  };

  const getHumidityLevel = (humidity: number) => {
    if (humidity < 30)
      return {
        text: "Dry",
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-950",
        border: "border-orange-200 dark:border-orange-800",
      };
    if (humidity < 70)
      return {
        text: "Comfortable",
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-950",
        border: "border-green-200 dark:border-green-800",
      };
    return {
      text: "Humid",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950",
      border: "border-blue-200 dark:border-blue-800",
    };
  };

  const tempComfort = getTemperatureLevel(data.temperature);
  const humidityComfort = getHumidityLevel(data.humidity);

  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Environment Analytics
      </h2>

      {/* Statistics Pills */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Temperature Pill */}
        <div className="bg-card border-2 border-red-500 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
              <Thermometer className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-lg font-bold text-red-600">
              {tempStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">°C</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">{tempStats.avg.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">{tempStats.min.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">{tempStats.max.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Humidity Pill */}
        <div className="bg-card border-2 border-blue-500 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-lg font-bold text-blue-600">
              {humidityStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">%</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">
                {humidityStats.avg.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">
                {humidityStats.min.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">
                {humidityStats.max.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comfort Level Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Thermal Comfort */}
        <div
          className={`border rounded-xl p-4 text-center ${tempComfort.border} ${tempComfort.bg}`}
        >
          <div className="text-sm font-medium text-foreground mb-2">
            Thermal Comfort
          </div>
          <div className={`text-lg font-semibold ${tempComfort.color}`}>
            {tempComfort.text}
          </div>
        </div>

        {/* Humidity Level */}
        <div
          className={`border rounded-xl p-4 text-center ${humidityComfort.border} ${humidityComfort.bg}`}
        >
          <div className="text-sm font-medium text-foreground mb-2">
            Humidity Level
          </div>
          <div className={`text-lg font-semibold ${humidityComfort.color}`}>
            {humidityComfort.text}
          </div>
        </div>
      </div>

      {/* Environment Chart */}
      {chartData.length > 0 ? (
        <EnvironmentChart initialData={chartData} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No environment data available yet.
        </div>
      )}
    </div>
  );
}
