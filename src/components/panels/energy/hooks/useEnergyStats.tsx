// src/components/panels/energy/hooks/useEnergyStats.ts
import { useMemo } from "react";
import { ChartData } from "@/types";

export function useEnergyStats(chartData: ChartData[]) {
  const stats = useMemo(() => {
    const calculateStats = (key: keyof ChartData) => {
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

      let decimalPlaces = 1;
      if (key === "current") decimalPlaces = 3;
      if (key === "powerFactor") decimalPlaces = 2;
      if (key === "energy") decimalPlaces = 2;
      if (key === "frequency") decimalPlaces = 1;

      return {
        min: parseFloat(min.toFixed(decimalPlaces)),
        max: parseFloat(max.toFixed(decimalPlaces)),
        avg: parseFloat(avg.toFixed(decimalPlaces)),
        current: parseFloat(current.toFixed(decimalPlaces)),
      };
    };

    return {
      power: calculateStats("power"),
      voltage: calculateStats("voltage"),
      current: calculateStats("current"),
      apparentPower: calculateStats("apparentPower"),
      reactivePower: calculateStats("reactivePower"),
      powerFactor: calculateStats("powerFactor"),
      frequency: calculateStats("frequency"),
      energy: calculateStats("energy"),
    };
  }, [chartData]);

  return { stats };
}
