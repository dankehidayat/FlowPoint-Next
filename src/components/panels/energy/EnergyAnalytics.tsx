// src/components/panels/energy/EnergyAnalytics.tsx
"use client";

import { Card } from "@/components/ui/cards/Card";
import { CardContent } from "@/components/ui/cards/CardContent";
import { CardHeader } from "@/components/ui/cards/CardHeader";
import { CardTitle } from "@/components/ui/cards/CardTitle";

import { ChartData, SensorData } from "@/types";
import { useEnergyData } from "./hooks/useEnergyData";
import { useEnergyStats } from "./hooks/useEnergyStats";
import EnergyStats from "./components/EnergyStats";
import ChartsGrid from "./components/ChartsGrid";
import TimeRangeSelector from "@/components/ui/time-range/TimeRangeSelector";
import { useState } from "react";

interface EnergyAnalyticsProps {
  data: ChartData[];
  currentData: SensorData;
  timeRange: number;
  onTimeRangeChange: (hours: number) => void;
}

export default function EnergyAnalytics({
  data,
  currentData,
  timeRange,
  onTimeRangeChange,
}: EnergyAnalyticsProps) {
  const [energyTimeRange, setEnergyTimeRange] = useState<number>(timeRange);
  const { chartData, loading, error } = useEnergyData(data, energyTimeRange);
  const { stats } = useEnergyStats(chartData);

  const handleEnergyTimeRangeChange = (hours: number) => {
    setEnergyTimeRange(hours);
  };

  if (loading && chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading energy data...</div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200">
        <CardTitle>Energy Analytics</CardTitle>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          {error && <div className="text-sm text-red-600">⚠️ {error}</div>}
          <TimeRangeSelector
            onTimeRangeChange={handleEnergyTimeRangeChange}
            defaultRange={energyTimeRange}
            className="w-full lg:w-auto"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Panel - All energy metrics */}
        <EnergyStats stats={stats} />

        {/* Horizontal Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Charts Grid - Using individual chart components */}
        <ChartsGrid chartData={chartData} timeRange={energyTimeRange} />

        {/* Horizontal Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Simplified Data Source Info */}
        <div className="text-center text-sm text-gray-500">
          Charts & Statistics: {chartData.length} historical readings from
          Prisma + PostgreSQL (Time Range: {energyTimeRange}H)
        </div>
      </CardContent>
    </Card>
  );
}
