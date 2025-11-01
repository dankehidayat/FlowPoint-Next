// src/components/panels/summary/components/StatsGrid.tsx
"use client";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Environment Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          Environment Metrics
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Temperature */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
                <Thermometer className="w-5 h-5 text-red-500" />
              </div>
              {trends.temp !== "stable" && (
                <div
                  className={`text-xs ${
                    trends.temp === "up" ? "text-red-500" : "text-blue-500"
                  } trend-animation`}
                >
                  {trends.temp === "up" ? "↗" : "↘"}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {data.temperature.toFixed(1)}°C
            </div>
            <div className="text-xs text-gray-500">Temperature</div>
          </div>

          {/* Humidity */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              {trends.humidity !== "stable" && (
                <div
                  className={`text-xs ${
                    trends.humidity === "up"
                      ? "text-blue-500"
                      : "text-green-500"
                  } trend-animation`}
                >
                  {trends.humidity === "up" ? "↗" : "↘"}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {data.humidity.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Humidity</div>
          </div>
        </div>

        {/* Comfort Indicators */}
        <div className="grid grid-cols-2 gap-4">
          {/* Thermal Comfort */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-orange-100/80 border border-orange-200/50">
                <Thermometer className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Thermal Comfort
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div className="text-lg font-semibold text-gray-900">
                {data.temperature < 18
                  ? "Cool"
                  : data.temperature < 26
                  ? "Ideal"
                  : "Warm"}
              </div>
            </div>
          </div>

          {/* Humidity Level */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-cyan-100/80 border border-cyan-200/50">
                <Droplets className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Humidity Level
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div className="text-lg font-semibold text-gray-900">
                {data.humidity < 30
                  ? "Dry"
                  : data.humidity < 70
                  ? "Comfortable"
                  : "Humid"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <div className="p-2 rounded-xl bg-yellow-100/80 border border-yellow-200/50">
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          Energy Metrics
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Active Power */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-green-100/80 border border-green-200/50">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              {trends.power !== "stable" && (
                <div
                  className={`text-xs ${
                    trends.power === "up" ? "text-orange-500" : "text-green-500"
                  }`}
                >
                  {trends.power === "up" ? "↗" : "↘"}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {data.power.toFixed(1)}W
            </div>
            <div className="text-xs text-gray-500">Active Power</div>
          </div>

          {/* Power Factor */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-purple-100/80 border border-purple-200/50">
                <Gauge className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {energyMetrics.powerFactor.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Power Factor</div>
          </div>
        </div>

        {/* Additional Energy Info */}
        <div className="grid grid-cols-2 gap-4">
          {/* Energy Consumed */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
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
                <div className="text-lg font-bold text-gray-900">
                  {data.energy.toFixed(2)} Wh
                </div>
                <div className="text-xs text-gray-500">
                  {(data.energy / 1000).toFixed(4)} kWh
                </div>
              </div>
            </div>
          </div>

          {/* Daily Estimate */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
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
                <div className="text-lg font-bold text-gray-900">
                  {(energyMetrics.dailyEstimate / 1000).toFixed(2)} kWh
                </div>
                <div className="text-xs text-gray-500">Projected 24h</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
