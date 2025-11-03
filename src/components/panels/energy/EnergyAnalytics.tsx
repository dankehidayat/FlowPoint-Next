// src/components/panels/energy/EnergyAnalytics.tsx
"use client";

import { motion } from "framer-motion";
import { ChartData, SensorData } from "@/types";
import { useEnergyStats } from "./hooks/useEnergyStats";
import EnergyOverview from "./components/EnergyOverview";
import EnergyChartsGrid from "./components/EnergyChartsGrid";
import AnalyticsHeader from "../shared/components/AnalyticsHeader";

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
  const { stats } = useEnergyStats(data);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <AnalyticsHeader
        title="Energy Analytics"
        description="Real-time power consumption and electrical parameters"
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
      />

      {/* Energy Overview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <EnergyOverview chartData={data} />
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <EnergyChartsGrid chartData={data} timeRange={timeRange} />
      </motion.div>
    </motion.div>
  );
}
