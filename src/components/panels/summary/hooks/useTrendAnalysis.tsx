// src/components/panels/summary/hooks/useTrendAnalysis.ts
import { SensorData } from "@/types";
import { useState, useEffect } from "react";

type Trend = "up" | "down" | "stable";

export function useTrendAnalysis(data: SensorData) {
  const [previousData, setPreviousData] = useState(data);
  const [trends, setTrends] = useState<{
    temp: Trend;
    humidity: Trend;
    power: Trend;
  }>({
    temp: "stable",
    humidity: "stable",
    power: "stable",
  });

  useEffect(() => {
    const newTrends = {
      temp: (data.temperature > previousData.temperature
        ? "up"
        : data.temperature < previousData.temperature
        ? "down"
        : "stable") as Trend,
      humidity: (data.humidity > previousData.humidity
        ? "up"
        : data.humidity < previousData.humidity
        ? "down"
        : "stable") as Trend,
      power: (data.power > previousData.power
        ? "up"
        : data.power < previousData.power
        ? "down"
        : "stable") as Trend,
    };
    setTrends(newTrends);
    setPreviousData(data);
  }, [data, previousData]);

  return { trends, previousData };
}
