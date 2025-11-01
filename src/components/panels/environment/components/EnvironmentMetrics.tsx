// src/components/panels/environment/components/EnvironmentMetrics.tsx
"use client";

import { SensorData, ChartData } from "@/types";
import { useEnvironmentMetrics } from "../hooks/useEnvironmentMetrics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface EnvironmentMetricsProps {
  data: SensorData;
  chartData: ChartData[];
}

export default function EnvironmentMetrics({
  data,
  chartData,
}: EnvironmentMetricsProps) {
  const metrics = useEnvironmentMetrics(data, chartData);

  const getTrendIcon = (trend?: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-red-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-blue-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getComfortColor = (level: string) => {
    switch (level) {
      case "Excellent":
        return "text-green-600 bg-green-100";
      case "Good":
        return "text-blue-600 bg-blue-100";
      case "Fair":
        return "text-orange-600 bg-orange-100";
      case "Poor":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 text-xs">
      {/* Temperature Trend */}
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
        <span className="text-muted-foreground">Temp Trend</span>
        <div className="flex items-center gap-1">
          {getTrendIcon(metrics.temperature.trend)}
        </div>
      </div>

      {/* Humidity Trend */}
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
        <span className="text-muted-foreground">Humidity Trend</span>
        <div className="flex items-center gap-1">
          {getTrendIcon(metrics.humidity.trend)}
        </div>
      </div>

      {/* Comfort Level */}
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
        <span className="text-muted-foreground">Comfort</span>
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-medium ${getComfortColor(
            metrics.comfortLevel
          )}`}
        >
          {metrics.comfortLevel}
        </span>
      </div>
    </div>
  );
}
