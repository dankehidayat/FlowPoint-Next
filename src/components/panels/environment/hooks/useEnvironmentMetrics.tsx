// src/components/panels/environment/hooks/useEnvironmentMetrics.ts
import { SensorData, ChartData } from "@/types";
import { useMemo } from "react";

export interface EnvironmentMetrics {
  temperature: {
    current: number;
    unit: string;
    trend?: "up" | "down" | "stable";
  };
  humidity: {
    current: number;
    unit: string;
    trend?: "up" | "down" | "stable";
  };
  comfortLevel: "Excellent" | "Good" | "Fair" | "Poor";
}

export function useEnvironmentMetrics(
  data: SensorData,
  chartData: ChartData[]
): EnvironmentMetrics {
  const metrics = useMemo(() => {
    // Calculate trends based on recent chart data
    const recentData = chartData.slice(-10); // Last 10 data points
    const temperatureTrend = calculateTrend(recentData, "temperature");
    const humidityTrend = calculateTrend(recentData, "humidity");

    // Calculate comfort level based on temperature and humidity
    const comfortLevel = calculateComfortLevel(data.temperature, data.humidity);

    return {
      temperature: {
        current: data.temperature,
        unit: "°C",
        trend: temperatureTrend,
      },
      humidity: {
        current: data.humidity,
        unit: "%",
        trend: humidityTrend,
      },
      comfortLevel,
    };
  }, [data, chartData]);

  return metrics;
}

function calculateTrend(
  data: ChartData[],
  key: "temperature" | "humidity"
): "up" | "down" | "stable" {
  if (data.length < 2) return "stable";

  const firstValue = data[0][key];
  const lastValue = data[data.length - 1][key];
  const threshold = key === "temperature" ? 0.1 : 1; // Different thresholds for temp vs humidity

  if (lastValue > firstValue + threshold) return "up";
  if (lastValue < firstValue - threshold) return "down";
  return "stable";
}

function calculateComfortLevel(
  temperature: number,
  humidity: number
): "Excellent" | "Good" | "Fair" | "Poor" {
  let score = 0;

  // Temperature scoring (ideal: 20-24°C)
  if (temperature >= 20 && temperature <= 24) score += 2;
  else if (temperature >= 18 && temperature <= 26) score += 1;
  else if (temperature < 16 || temperature > 28) score -= 1;

  // Humidity scoring (ideal: 40-60%)
  if (humidity >= 40 && humidity <= 60) score += 2;
  else if (humidity >= 30 && humidity <= 70) score += 1;
  else if (humidity < 25 || humidity > 75) score -= 1;

  if (score >= 3) return "Excellent";
  if (score >= 1) return "Good";
  if (score >= -1) return "Fair";
  return "Poor";
}
