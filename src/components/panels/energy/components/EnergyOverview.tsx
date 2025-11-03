// src/components/panels/energy/components/EnergyOverview.tsx
"use client";

import { ChartData } from "@/types";
import { useEnergyStats } from "../hooks/useEnergyStats";
import MetricCard from "../../shared/components/MetricCard";
import {
  Zap,
  Gauge,
  Sigma,
  CircleDashed,
  Activity,
  Waves,
  Battery,
  Plug,
} from "lucide-react";

interface EnergyOverviewProps {
  chartData: ChartData[];
}

const energyConfigs = [
  {
    key: "power",
    name: "Active Power",
    unit: "W",
    icon: Plug,
    color: "green",
    decimalPlaces: 1,
  },
  {
    key: "apparentPower",
    name: "Apparent Power",
    unit: "VA",
    icon: Zap,
    color: "yellow",
    decimalPlaces: 1,
  },
  {
    key: "reactivePower",
    name: "Reactive Power",
    unit: "VAR",
    icon: CircleDashed,
    color: "indigo",
    decimalPlaces: 1,
  },
  {
    key: "powerFactor",
    name: "Power Factor",
    unit: "%",
    icon: Gauge,
    color: "cyan",
    decimalPlaces: 2,
  },
  {
    key: "voltage",
    name: "Voltage",
    unit: "V",
    icon: Sigma,
    color: "blue",
    decimalPlaces: 1,
  },
  {
    key: "current",
    name: "Current",
    unit: "A",
    icon: Activity,
    color: "purple",
    decimalPlaces: 3,
  },
  {
    key: "frequency",
    name: "Frequency",
    unit: "Hz",
    icon: Waves,
    color: "orange",
    decimalPlaces: 1,
  },
  {
    key: "energy",
    name: "Energy",
    unit: "Wh",
    icon: Battery,
    color: "teal",
    decimalPlaces: 2,
  },
];

// Simple trend calculation for energy metrics
const calculateEnergyTrend = (
  chartData: ChartData[],
  key: keyof ChartData
): "up" | "down" | "stable" => {
  if (chartData.length < 2) return "stable";

  const recentData = chartData.slice(-5);
  const firstValue = recentData[0][key] as number;
  const lastValue = recentData[recentData.length - 1][key] as number;

  const threshold = key === "current" ? 0.01 : key === "powerFactor" ? 0.1 : 1;

  if (lastValue > firstValue + threshold) return "up";
  if (lastValue < firstValue - threshold) return "down";
  return "stable";
};

export default function EnergyOverview({ chartData }: EnergyOverviewProps) {
  const { stats } = useEnergyStats(chartData);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {energyConfigs.map((config, index) => (
        <MetricCard
          key={config.key}
          config={config}
          stats={stats[config.key as keyof typeof stats]}
          trend={calculateEnergyTrend(chartData, config.key as keyof ChartData)}
          showTrend={true}
          index={index}
        />
      ))}
    </div>
  );
}
