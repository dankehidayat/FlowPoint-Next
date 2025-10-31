// src/components/EnvironmentPanel.tsx
"use client";

import { SensorData, ChartData } from "@/types";
import EnvironmentAnalytics from "./EnvironmentAnalytics";

interface EnvironmentPanelProps {
  data: SensorData;
  chartData: ChartData[];
}

export default function EnvironmentPanel({
  data,
  chartData,
}: EnvironmentPanelProps) {
  return <EnvironmentAnalytics data={data} chartData={chartData} />;
}
