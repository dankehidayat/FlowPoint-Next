// src/components/panels/environment/hooks/useEnvironmentStats.ts
import { useMemo } from "react";
import { ChartData, Stats } from "@/types";

export function useEnvironmentStats(chartData: ChartData[]) {
  const stats = useMemo(() => {
    const calculateStats = (key: keyof ChartData): Stats => {
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
    };

    return {
      temperature: calculateStats("temperature"),
      humidity: calculateStats("humidity"),
    };
  }, [chartData]);

  return { stats };
}
