// src/components/panels/summary/components/StatsGrid.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SensorData } from "@/types";
import {
  Thermometer,
  Droplets,
  Zap,
  Battery,
  Activity,
  Gauge,
  Clock,
  Eye,
} from "lucide-react";

interface StatsGridProps {
  data: SensorData;
  trends: any;
}

export default function StatsGrid({ data, trends }: StatsGridProps) {
  const getEnergyMetrics = () => {
    let powerFactor = 0;
    if (data.apparentPower > 0) {
      powerFactor = (data.power / data.apparentPower) * 100;
    }
    powerFactor = Math.max(0, Math.min(100, powerFactor));

    const dailyEstimate = data.energy * 24;

    return {
      powerFactor,
      dailyEstimate,
    };
  };

  const energyMetrics = getEnergyMetrics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
    >
      {/* Environment Metrics */}
      <div className="space-y-4">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg font-semibold text-gray-900 flex items-center gap-2"
        >
          <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          Environment Metrics
        </motion.h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Temperature */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
                <Thermometer className="w-5 h-5 text-red-500" />
              </div>
              <AnimatePresence mode="wait">
                {trends.temp !== "stable" && (
                  <motion.div
                    key={`temp-trend-${trends.temp}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-xs ${
                      trends.temp === "up" ? "text-red-500" : "text-blue-500"
                    }`}
                  >
                    {trends.temp === "up" ? "↗" : "↘"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1 flex items-baseline">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`temp-value-${data.temperature}`}
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {data.temperature.toFixed(1)}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm font-normal ml-0.5">°C</span>
            </div>
            <div className="text-xs text-gray-500">Temperature</div>
          </motion.div>

          {/* Humidity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <AnimatePresence mode="wait">
                {trends.humidity !== "stable" && (
                  <motion.div
                    key={`humidity-trend-${trends.humidity}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-xs ${
                      trends.humidity === "up"
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {trends.humidity === "up" ? "↗" : "↘"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1 flex items-baseline">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`humidity-value-${data.humidity}`}
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {data.humidity.toFixed(1)}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm font-normal ml-0.5">%</span>
            </div>
            <div className="text-xs text-gray-500">Humidity</div>
          </motion.div>
        </div>

        {/* Comfort Indicators - Fixed height to match energy cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Thermal Comfort */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 flex flex-col h-full min-h-[140px]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-orange-100/80 border border-orange-200/50">
                <Thermometer className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Thermal Comfort
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`thermal-comfort-${data.temperature}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-gray-900"
                >
                  {data.temperature < 18
                    ? "Cool"
                    : data.temperature < 26
                    ? "Ideal"
                    : "Warm"}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Humidity Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 flex flex-col h-full min-h-[140px]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-cyan-100/80 border border-cyan-200/50">
                <Droplets className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Humidity Level
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`humidity-level-${data.humidity}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl font-bold text-gray-900"
                >
                  {data.humidity < 30
                    ? "Dry"
                    : data.humidity < 70
                    ? "Comfortable"
                    : "Humid"}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Energy Metrics */}
      <div className="space-y-4">
        <motion.h3
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg font-semibold text-gray-900 flex items-center gap-2"
        >
          <div className="p-2 rounded-xl bg-yellow-100/80 border border-yellow-200/50">
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          Energy Metrics
        </motion.h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Active Power */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-green-100/80 border border-green-200/50">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <AnimatePresence mode="wait">
                {trends.power !== "stable" && (
                  <motion.div
                    key={`power-trend-${trends.power}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`text-xs ${
                      trends.power === "up"
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {trends.power === "up" ? "↗" : "↘"}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1 flex items-baseline">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`power-value-${data.power}`}
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {data.power.toFixed(1)}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm font-normal ml-0.5">W</span>
            </div>
            <div className="text-xs text-gray-500">Active Power</div>
          </motion.div>

          {/* Power Factor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-purple-100/80 border border-purple-200/50">
                <Gauge className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1 flex items-baseline">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`power-factor-${energyMetrics.powerFactor}`}
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {energyMetrics.powerFactor.toFixed(0)}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm font-normal ml-0.5">%</span>
            </div>
            <div className="text-xs text-gray-500">Power Factor</div>
          </motion.div>
        </div>

        {/* Additional Energy Info */}
        <div className="grid grid-cols-2 gap-4">
          {/* Energy Consumed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 flex flex-col h-full min-h-[140px]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-200/50">
                <Battery className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Energy Used
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`energy-used-${data.energy}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-gray-900"
                  >
                    {data.energy.toFixed(2)} Wh
                  </motion.div>
                </AnimatePresence>
                <div className="text-xs text-gray-500">
                  {(data.energy / 1000).toFixed(4)} kWh
                </div>
              </div>
            </div>
          </motion.div>

          {/* Daily Estimate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-4 flex flex-col h-full min-h-[140px]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-sky-100/80 border border-sky-200/50">
                <Clock className="w-5 h-5 text-sky-500" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Daily Estimate
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`daily-estimate-${energyMetrics.dailyEstimate}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg font-bold text-gray-900"
                  >
                    {(energyMetrics.dailyEstimate / 1000).toFixed(2)} kWh
                  </motion.div>
                </AnimatePresence>
                <div className="text-xs text-gray-500">Projected 24h</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
