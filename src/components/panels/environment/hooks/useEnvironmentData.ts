// src/components/panels/environment/hooks/useEnvironmentData.ts
import { SensorData, ChartData } from "@/types";
import { useState, useEffect } from "react";

export function useEnvironmentData(
  initialData: SensorData,
  chartData: ChartData[],
  timeRange: number
) {
  const [environmentChartData, setEnvironmentChartData] = useState<ChartData[]>(
    chartData || []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEnvironmentData = async () => {
      if (timeRange <= 24 && chartData && chartData.length > 0) {
        // For short time ranges, use client-side filtering
        const cutoffTime = new Date(Date.now() - timeRange * 60 * 60 * 1000);
        const filteredData = chartData.filter(
          (item) => new Date(item.timestamp) >= cutoffTime
        );
        setEnvironmentChartData(filteredData);
      } else if (timeRange > 24) {
        // For longer ranges, fetch specific environment data
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/sensor?hours=${timeRange}&fields=temperature,humidity&smooth=true`
          );
          const result = await response.json();

          if (result.success && result.data) {
            let transformedData: ChartData[] = [];

            if (Array.isArray(result.data)) {
              transformedData = result.data.map((item: any) => ({
                time: new Date(item.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  ...(timeRange > 24 && { month: "short", day: "numeric" }),
                }),
                timestamp: item.timestamp,
                temperature: item.temperature || 0,
                humidity: item.humidity || 0,
                power: item.power || 0,
                apparentPower: item.apparentPower || 0,
                reactivePower: item.reactivePower || 0,
                voltage: item.voltage || 0,
                current: item.current || 0,
                energy: item.energy || 0,
                frequency: item.frequency || 0,
                powerFactor: item.powerFactor || 0,
              }));
            } else if (typeof result.data === "object") {
              const temperatureData = result.data.temperature || [];
              const humidityData = result.data.humidity || [];

              transformedData = temperatureData.map(
                (point: any, index: number) => ({
                  time: new Date(point.x).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    ...(timeRange > 24 && { month: "short", day: "numeric" }),
                  }),
                  timestamp: new Date(point.x).toISOString(),
                  temperature: point.y || 0,
                  humidity: humidityData[index]?.y || 0,
                  power: 0,
                  apparentPower: 0,
                  reactivePower: 0,
                  voltage: 0,
                  current: 0,
                  energy: 0,
                  frequency: 0,
                  powerFactor: 0,
                })
              );
            }

            setEnvironmentChartData(transformedData);
          }
        } catch (error) {
          console.error("Failed to fetch environment data:", error);
          setEnvironmentChartData(chartData || []);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchEnvironmentData();
  }, [timeRange, chartData]);

  return {
    environmentChartData,
    isLoading,
  };
}
