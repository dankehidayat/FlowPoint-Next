// src/components/panels/summary/SummaryAnalytics.tsx
"use client";

import { motion } from "framer-motion";
import { SensorData } from "@/types";
import { Clock } from "lucide-react";
import { useTrendAnalysis } from "./hooks/useTrendAnalysis";
import { useComfortStatus } from "./hooks/useComfortStatus";
import { useSmartRecommendations } from "./hooks/useSmartRecommendations";
import ComfortStatus from "./components/ComfortStatus";
import StatsGrid from "./components/StatsGrid";
import SmartRecommendations from "./components/SmartRecommendations";
import { useState, useEffect } from "react";

interface SummaryDashboardProps {
  data: SensorData;
}

export default function SummaryDashboard({ data }: SummaryDashboardProps) {
  const { trends, previousData } = useTrendAnalysis(data);
  const { overallComfort, getComfortIconBg } = useComfortStatus(data);
  const { recommendations, getPowerImpactInfo } = useSmartRecommendations(
    data,
    trends
  );

  const [currentTime, setCurrentTime] = useState(new Date(data.timestamp));

  // Update time every second (without animation)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Animation for red circle only
  const redCircleTransition = {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {getGreeting()}!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-gray-600 text-lg"
          >
            Current environment is{" "}
            <motion.span
              key={`comfort-text-${overallComfort.level}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`font-semibold ${overallComfort.color}`}
            >
              {overallComfort.level.toLowerCase()}
            </motion.span>
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex items-center gap-3 mt-4 lg:mt-0"
        >
          {/* Completely static badge container with only red circle animating */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 ${overallComfort.bg} ${overallComfort.border} border`}
          >
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                backgroundColor: ["#ef4444", "#dc2626", "#ef4444"],
              }}
              transition={redCircleTransition}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            {/* Static "Live" text */}
            <span className={overallComfort.color}>Live</span>
          </div>

          {/* Clock with no animation */}
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </motion.div>
      </div>

      {/* Main Status Card */}
      <ComfortStatus
        data={data}
        overallComfort={overallComfort}
        trends={trends}
        getComfortIconBg={getComfortIconBg}
      />

      {/* Comprehensive Stats Grid */}
      <StatsGrid data={data} trends={trends} />

      {/* Enhanced Smart Recommendations with Trends */}
      <SmartRecommendations
        recommendations={recommendations}
        getPowerImpactInfo={getPowerImpactInfo}
      />
    </motion.div>
  );
}
