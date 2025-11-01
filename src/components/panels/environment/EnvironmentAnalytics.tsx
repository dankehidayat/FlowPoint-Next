// src/components/panels/environment/EnvironmentAnalytics.tsx
"use client";

import { Card } from "@/components/ui/cards/Card";
import { CardContent } from "@/components/ui/cards/CardContent";
import { CardHeader } from "@/components/ui/cards/CardHeader";
import { CardTitle } from "@/components/ui/cards/CardTitle";

import { SensorData, ChartData } from "@/types";
import EnvironmentChart from "@/components/charts/EnvironmentChart";
import TimeRangeSelector from "@/components/ui/time-range/TimeRangeSelector";

import { useEnvironmentData } from "./hooks/useEnvironmentData";
import { useState } from "react";
import TrendCards from "./components/TrendCards";
import StatsPills from "./components/StatsPills";

interface EnvironmentAnalyticsProps {
  data: SensorData;
  chartData: ChartData[];
  timeRange: number;
}

export default function EnvironmentAnalytics({
  data,
  chartData,
  timeRange: initialTimeRange,
}: EnvironmentAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<number>(initialTimeRange);
  const { environmentChartData, isLoading } = useEnvironmentData(
    data,
    chartData,
    timeRange
  );

  const handleTimeRangeChange = (hours: number) => {
    setTimeRange(hours);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-200">
        <CardTitle>Environment Analytics</CardTitle>
        <TimeRangeSelector
          onTimeRangeChange={handleTimeRangeChange}
          defaultRange={timeRange}
          className="w-full lg:w-auto"
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Combined Trend Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Environment Trends
            </h3>
          </div>
          <TrendCards data={data} />
          <StatsPills data={data} chartData={environmentChartData} />
        </div>

        {/* Environment Chart */}
        <EnvironmentChart
          data={environmentChartData}
          timeRange={timeRange}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
