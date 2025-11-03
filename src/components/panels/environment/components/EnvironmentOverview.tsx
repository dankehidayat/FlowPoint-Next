// src/components/panels/environment/components/EnvironmentOverview.tsx
"use client";

import { SensorData, ChartData, Stats } from "@/types";
import { Thermometer, Droplets, TrendingUp, TrendingDown } from "lucide-react";
import { useTrendAnalysis } from "../hooks/useTrendAnalysis";
import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MetricCard from "../../shared/components/MetricCard";

interface EnvironmentOverviewProps {
  data: SensorData;
  chartData: ChartData[];
}

const tempConfig = {
  key: "temperature",
  name: "Temperature",
  unit: "°C",
  icon: Thermometer,
  color: "red",
  decimalPlaces: 1,
};

const humidityConfig = {
  key: "humidity",
  name: "Humidity",
  unit: "%",
  icon: Droplets,
  color: "blue",
  decimalPlaces: 1,
};

// Calculate trend from chart data (same logic as energy panel)
const calculateEnvironmentTrend = (
  chartData: ChartData[],
  key: keyof ChartData
): "up" | "down" | "stable" => {
  if (chartData.length < 2) return "stable";

  const recentData = chartData.slice(-5);
  const firstValue = recentData[0][key] as number;
  const lastValue = recentData[recentData.length - 1][key] as number;

  const threshold = key === "temperature" ? 0.5 : 1; // 0.5°C for temp, 1% for humidity

  if (lastValue > firstValue + threshold) return "up";
  if (lastValue < firstValue - threshold) return "down";
  return "stable";
};

export default function EnvironmentOverview({
  data,
  chartData,
}: EnvironmentOverviewProps) {
  const { trendAnalysis, getTrendDescription } = useTrendAnalysis(data);

  const calculateStats = useCallback(
    (key: keyof ChartData): Stats => {
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
    },
    [chartData]
  );

  const tempStats = calculateStats("temperature");
  const humidityStats = calculateStats("humidity");

  // Calculate trends from chart data
  const tempTrend = calculateEnvironmentTrend(chartData, "temperature");
  const humidityTrend = calculateEnvironmentTrend(chartData, "humidity");

  return (
    <div className="space-y-6">
      {/* Main Stats Pills - Temperature & Humidity */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          config={tempConfig}
          stats={tempStats}
          trend={tempTrend}
          showTrend={true}
          index={0}
        />
        <MetricCard
          config={humidityConfig}
          stats={humidityStats}
          trend={humidityTrend}
          showTrend={true}
          index={1}
        />
      </div>

      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Temperature Trend Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
                <Thermometer className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-semibold text-gray-900">
                Temperature Trend
              </span>
            </div>
            <AnimatePresence mode="wait">
              {trendAnalysis.temp !== "stable" &&
                (trendAnalysis.temp === "up" ? (
                  <motion.div
                    key="temp-trend-up"
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="w-5 h-5 text-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="temp-trend-down"
                    initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingDown className="w-5 h-5 text-blue-500" />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`temp-desc-${trendAnalysis.temp}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-gray-600"
            >
              {getTrendDescription("temperature")}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Humidity Trend Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">
                Humidity Trend
              </span>
            </div>
            <AnimatePresence mode="wait">
              {trendAnalysis.humidity !== "stable" &&
                (trendAnalysis.humidity === "up" ? (
                  <motion.div
                    key="humidity-trend-up"
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="humidity-trend-down"
                    initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`humidity-desc-${trendAnalysis.humidity}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-gray-600"
            >
              {getTrendDescription("humidity")}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
