// src/components/panels/energy/components/ChartsGrid.tsx
"use client";

import { ChartData } from "@/types";
import PowerConsumptionChart from "@/components/charts/PowerConsumptionChart";
import VoltageChart from "@/components/charts/VoltageChart";
import CurrentChart from "@/components/charts/CurrentChart";
import PowerAnalysisChart from "@/components/charts/PowerAnalysisChart";

interface ChartsGridProps {
  chartData: ChartData[];
  timeRange: number;
}

export default function ChartsGrid({ chartData, timeRange }: ChartsGridProps) {
  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No historical energy data available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Power Consumption */}
      <PowerConsumptionChart data={chartData} timeRange={timeRange} />

      {/* Voltage Chart */}
      <VoltageChart data={chartData} timeRange={timeRange} />

      {/* Current Chart */}
      <CurrentChart data={chartData} timeRange={timeRange} />

      {/* Power Analysis */}
      <div className="lg:col-span-2">
        <PowerAnalysisChart initialData={chartData} timeRange={timeRange} />
      </div>
    </div>
  );
}
