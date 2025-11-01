// src/components/panels/summary/SummaryDashboard.tsx
"use client";

import { SensorData } from "@/types";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useTrendAnalysis } from "./hooks/useTrendAnalysis";
import { useComfortStatus } from "./hooks/useComfortStatus";
import { useSmartRecommendations } from "./hooks/useSmartRecommendations";
import ComfortStatus from "./components/ComfortStatus";
import StatsGrid from "./components/StatsGrid";
import SmartRecommendations from "./components/SmartRecommendations";

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreeting()}!
          </h2>
          <p className="text-gray-600 text-lg">
            Current environment is{" "}
            <span className={`font-semibold ${overallComfort.color}`}>
              {overallComfort.level.toLowerCase()}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${overallComfort.bg} ${overallComfort.border} border`}
          >
            <span className={overallComfort.color}>Live</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
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
    </div>
  );
}
