// src/components/panels/environment/EnvironmentAnalytics.tsx
"use client";

import { motion } from "framer-motion";
import { SensorData, ChartData } from "@/types";
import EnvironmentChart from "@/components/charts/EnvironmentChart";
import { useEnvironmentData } from "./hooks/useEnvironmentData";
import { useState } from "react";
import EnvironmentOverview from "./components/EnvironmentOverview";
import AnalyticsHeader from "../shared/components/AnalyticsHeader";

interface EnvironmentAnalyticsProps {
  data: SensorData;
  chartData: ChartData[];
  timeRange: number;
  onTimeRangeChange: (hours: number) => void;
}

export default function EnvironmentAnalytics({
  data,
  chartData,
  timeRange: initialTimeRange,
  onTimeRangeChange,
}: EnvironmentAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<number>(initialTimeRange);
  const { environmentChartData, isLoading } = useEnvironmentData(
    data,
    chartData,
    timeRange
  );

  const handleTimeRangeChange = (hours: number) => {
    setTimeRange(hours);
    onTimeRangeChange(hours);
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <AnalyticsHeader
        title="Environment Analytics"
        description="Real-time temperature and humidity monitoring"
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />

      {/* Environment Overview */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <EnvironmentOverview data={data} chartData={environmentChartData} />
      </motion.div>

      {/* Environment Chart */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
      >
        <EnvironmentChart
          data={environmentChartData}
          timeRange={timeRange}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}
