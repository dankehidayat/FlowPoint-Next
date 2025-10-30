// src/components/EnvironmentAnalytics.tsx
"use client";

import { ChartData, SensorData, Stats } from "@/types";
import { useCallback } from "react";
import EnvironmentChart from "./charts/EnvironmentChart";

interface EnvironmentAnalyticsProps {
  data: ChartData[];
  currentData: SensorData;
}

export default function EnvironmentAnalytics({
  data,
  currentData,
}: EnvironmentAnalyticsProps) {
  const calculateStats = useCallback(
    (key: keyof ChartData): Stats => {
      const values = data
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
    [data]
  );

  const tempStats = calculateStats("temperature");
  const humidityStats = calculateStats("humidity");

  const StatCard = ({
    title,
    stats,
    unit,
    color,
  }: {
    title: string;
    stats: Stats;
    unit: string;
    color: string;
  }) => (
    <div className="bg-card border rounded-lg p-3">
      <div className="text-sm text-muted-foreground font-medium mb-2">
        {title}
      </div>
      <div className="flex justify-between text-xs">
        <div className="text-center">
          <div className="text-muted-foreground">Current</div>
          <div className={`font-semibold text-sm ${color}`}>
            {stats.current.toFixed(1)}
            {unit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">Average</div>
          <div className="font-semibold text-sm">
            {stats.avg.toFixed(1)}
            {unit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">Range</div>
          <div className="font-semibold text-sm">
            {stats.min.toFixed(1)}/{stats.max.toFixed(1)}
            {unit}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Environment Analytics
      </h2>

      {/* Statistics Panel */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          title="Temperature"
          stats={tempStats}
          unit="°C"
          color="text-red-500"
        />
        <StatCard
          title="Humidity"
          stats={humidityStats}
          unit="%"
          color="text-blue-500"
        />
      </div>

      {/* Environment Chart - Removed duplicate title */}
      {data.length > 0 ? (
        <EnvironmentChart initialData={data} />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No environment data available yet.
        </div>
      )}

      {/* Current Values Display */}
      <div className="mt-6 grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            Current Temperature
          </div>
          <div className="text-lg font-semibold text-red-500">
            {currentData.temperature.toFixed(1)}°C
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Current Humidity</div>
          <div className="text-lg font-semibold text-blue-500">
            {currentData.humidity.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
