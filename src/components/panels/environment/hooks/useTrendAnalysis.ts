// src/components/panels/environment/hooks/useTrendAnalysis.ts
import { SensorData } from "@/types";
import { useState, useEffect } from "react";

export interface TrendAnalysis {
  temp: "up" | "down" | "stable";
  humidity: "up" | "down" | "stable";
  tempRate: number;
  humidityRate: number;
}

// Named export
export function useTrendAnalysis(data: SensorData) {
  const [previousTemp, setPreviousTemp] = useState(data.temperature);
  const [previousHumidity, setPreviousHumidity] = useState(data.humidity);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis>({
    temp: "stable",
    humidity: "stable",
    tempRate: 0,
    humidityRate: 0,
  });

  useEffect(() => {
    const tempChange =
      data.temperature > previousTemp + 0.1
        ? "up"
        : data.temperature < previousTemp - 0.1
        ? "down"
        : "stable";
    const humidityChange =
      data.humidity > previousHumidity + 0.5
        ? "up"
        : data.humidity < previousHumidity - 0.5
        ? "down"
        : "stable";

    const tempRate = Math.abs(data.temperature - previousTemp);
    const humidityRate = Math.abs(data.humidity - previousHumidity);

    setTrendAnalysis({
      temp: tempChange,
      humidity: humidityChange,
      tempRate,
      humidityRate,
    });

    setPreviousTemp(data.temperature);
    setPreviousHumidity(data.humidity);
  }, [data.temperature, data.humidity, previousTemp, previousHumidity]);

  const getTrendDescription = (type: "temperature" | "humidity") => {
    const trend =
      type === "temperature" ? trendAnalysis.temp : trendAnalysis.humidity;
    const rate =
      type === "temperature"
        ? trendAnalysis.tempRate
        : trendAnalysis.humidityRate;
    const current = type === "temperature" ? data.temperature : data.humidity;
    const unit = type === "temperature" ? "°C" : "%";

    if (trend === "up") {
      return `Rising quickly (${rate.toFixed(1)}${unit}/update)`;
    } else if (trend === "down") {
      return `Falling steadily (${rate.toFixed(1)}${unit}/update)`;
    } else {
      return `Stable at ${current}${unit}`;
    }
  };

  return {
    trendAnalysis,
    getTrendDescription,
  };
}
