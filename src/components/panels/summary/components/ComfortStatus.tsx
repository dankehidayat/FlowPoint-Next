// src/components/panels/summary/components/ComfortStatus.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SensorData } from "@/types";
import { Thermometer, Droplets, TrendingUp, TrendingDown } from "lucide-react";

interface ComfortStatusProps {
  data: SensorData;
  overallComfort: any;
  trends: any;
  getComfortIconBg: () => string;
}

export default function ComfortStatus({
  data,
  overallComfort,
  trends,
  getComfortIconBg,
}: ComfortStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`rounded-xl p-6 mb-6 border-2 ${overallComfort.border} ${overallComfort.bg} transition-all duration-500`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${getComfortIconBg()}`}>
            {overallComfort.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Comfort Status</h3>
            <motion.p
              key={`comfort-level-${overallComfort.level}`}
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`text-2xl font-bold ${overallComfort.color} mb-1`}
            >
              {overallComfort.level}
            </motion.p>
            <p className="text-gray-600 text-sm max-w-md">
              {overallComfort.recommendation}
            </p>
          </div>
        </div>
        <div className="text-right hidden lg:block">
          <div className="text-sm text-gray-500 mb-2">Current Readings</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 justify-end">
              <Thermometer className="w-4 h-4 text-red-500" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={`temp-reading-${data.temperature}`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-900"
                >
                  {data.temperature.toFixed(1)}°C
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {trends.temp !== "stable" &&
                  (trends.temp === "up" ? (
                    <motion.div
                      key="temp-trend-up"
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="temp-trend-down"
                      initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrendingDown className="w-4 h-4 text-blue-500" />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Droplets className="w-4 h-4 text-blue-500" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={`humidity-reading-${data.humidity}`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-900"
                >
                  {data.humidity.toFixed(1)}%
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                {trends.humidity !== "stable" &&
                  (trends.humidity === "up" ? (
                    <motion.div
                      key="humidity-trend-up"
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="humidity-trend-down"
                      initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
