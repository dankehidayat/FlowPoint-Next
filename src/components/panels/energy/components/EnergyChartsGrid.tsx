// src/components/panels/energy/components/EnergyChartsGrid.tsx
"use client";

import { motion } from "framer-motion";
import { ChartData } from "@/types";
import PowerConsumptionChart from "@/components/charts/PowerConsumptionChart";
import VoltageChart from "@/components/charts/VoltageChart";
import CurrentChart from "@/components/charts/CurrentChart";
import PowerAnalysisChart from "@/components/charts/PowerAnalysisChart";

interface EnergyChartsGridProps {
  chartData: ChartData[];
  timeRange: number;
}

export default function EnergyChartsGrid({
  chartData,
  timeRange,
}: EnergyChartsGridProps) {
  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 text-muted-foreground"
      >
        No historical energy data available yet.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      key={`charts-grid-${timeRange}`}
    >
      {/* Power Consumption */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PowerConsumptionChart data={chartData} timeRange={timeRange} />
      </motion.div>

      {/* Voltage Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <VoltageChart data={chartData} timeRange={timeRange} />
      </motion.div>

      {/* Current Chart */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <CurrentChart data={chartData} timeRange={timeRange} />
      </motion.div>

      {/* Power Analysis */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:col-span-2"
      >
        <PowerAnalysisChart initialData={chartData} timeRange={timeRange} />
      </motion.div>
    </motion.div>
  );
}
