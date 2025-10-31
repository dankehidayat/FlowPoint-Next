// src/components/EnvironmentAnalytics.tsx
"use client";

import { ChartData, SensorData, Stats } from "@/types";
import { useCallback, useState, useEffect } from "react";
import EnvironmentChart from "./charts/EnvironmentChart";
import {
  Thermometer,
  Droplets,
  Zap,
  TrendingUp,
  TrendingDown,
  Gauge,
} from "lucide-react";

interface EnvironmentAnalyticsProps {
  data: SensorData;
  chartData: ChartData[];
}

interface TrendAnalysis {
  temp: "up" | "down" | "stable";
  humidity: "up" | "down" | "stable";
  tempRate: number;
  humidityRate: number;
}

export default function EnvironmentAnalytics({
  data,
  chartData,
}: EnvironmentAnalyticsProps) {
  const [previousTemp, setPreviousTemp] = useState(data.temperature);
  const [previousHumidity, setPreviousHumidity] = useState(data.humidity);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis>({
    temp: "stable",
    humidity: "stable",
    tempRate: 0,
    humidityRate: 0,
  });

  useEffect(() => {
    const tempChange =
      data.temperature > previousTemp
        ? "up"
        : data.temperature < previousTemp
        ? "down"
        : "stable";
    const humidityChange =
      data.humidity > previousHumidity
        ? "up"
        : data.humidity < previousHumidity
        ? "down"
        : "stable";

    const tempRate = Math.abs(data.temperature - previousTemp);
    const humidityRate = Math.abs(data.humidity - previousHumidity);

    setTrendAnalysis({
      temp: tempChange,
      humidity: humidityChange,
      tempRate,
      humidityRate,
    });

    setPreviousTemp(data.temperature);
    setPreviousHumidity(data.humidity);
  }, [data.temperature, data.humidity]);

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
  const powerStats = calculateStats("power");
  const powerFactorStats = calculateStats("powerFactor");

  const getTrendDescription = (type: "temperature" | "humidity") => {
    const trend =
      type === "temperature" ? trendAnalysis.temp : trendAnalysis.humidity;
    const rate =
      type === "temperature"
        ? trendAnalysis.tempRate
        : trendAnalysis.humidityRate;
    const current = type === "temperature" ? data.temperature : data.humidity;
    const unit = type === "temperature" ? "°C" : "%";

    if (trend === "up") {
      return `Rising quickly (${rate.toFixed(1)}${unit}/update)`;
    } else if (trend === "down") {
      return `Falling steadily (${rate.toFixed(1)}${unit}/update)`;
    } else {
      return `Stable at ${current}${unit}`;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Environment Analytics
      </h2>

      {/* Trend Analysis */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
                <Thermometer className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-semibold text-gray-900">
                Temperature Trend
              </span>
            </div>
            {trendAnalysis.temp !== "stable" &&
              (trendAnalysis.temp === "up" ? (
                <TrendingUp className="w-5 h-5 text-red-500 trend-animation" />
              ) : (
                <TrendingDown className="w-5 h-5 text-blue-500 trend-animation" />
              ))}
          </div>
          <p className="text-sm text-gray-600">
            {getTrendDescription("temperature")}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">
                Humidity Trend
              </span>
            </div>
            {trendAnalysis.humidity !== "stable" &&
              (trendAnalysis.humidity === "up" ? (
                <TrendingUp className="w-5 h-5 text-blue-500 trend-animation" />
              ) : (
                <TrendingDown className="w-5 h-5 text-green-500 trend-animation" />
              ))}
          </div>
          <p className="text-sm text-gray-600">
            {getTrendDescription("humidity")}
          </p>
        </div>
      </div>

      {/* Statistics Pills */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Temperature Pill */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
              <Thermometer className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-red-600">
                {tempStats.current.toFixed(1)}
                <span className="text-sm font-normal ml-0.5">°C</span>
              </span>
              {trendAnalysis.temp !== "stable" && (
                <div
                  className={`text-xs ${
                    trendAnalysis.temp === "up"
                      ? "text-red-500"
                      : "text-blue-500"
                  } trend-animation`}
                >
                  {trendAnalysis.temp === "up" ? "↗ Rising" : "↘ Falling"}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Avg</div>
              <div className="font-semibold text-gray-900">
                {tempStats.avg.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Min</div>
              <div className="font-semibold text-gray-900">
                {tempStats.min.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Max</div>
              <div className="font-semibold text-gray-900">
                {tempStats.max.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Humidity Pill */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
              <Droplets className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-600">
                {humidityStats.current.toFixed(1)}
                <span className="text-sm font-normal ml-0.5">%</span>
              </span>
              {trendAnalysis.humidity !== "stable" && (
                <div
                  className={`text-xs ${
                    trendAnalysis.humidity === "up"
                      ? "text-blue-500"
                      : "text-green-500"
                  } trend-animation`}
                >
                  {trendAnalysis.humidity === "up" ? "↗ Rising" : "↘ Falling"}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Avg</div>
              <div className="font-semibold text-gray-900">
                {humidityStats.avg.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Min</div>
              <div className="font-semibold text-gray-900">
                {humidityStats.min.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Max</div>
              <div className="font-semibold text-gray-900">
                {humidityStats.max.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Power Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Active Power Pill */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-green-100/80 border border-green-200/50">
              <Zap className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-lg font-bold text-green-600">
              {powerStats.current.toFixed(1)}W
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Avg</div>
              <div className="font-semibold text-gray-900">
                {powerStats.avg.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Min</div>
              <div className="font-semibold text-gray-900">
                {powerStats.min.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Max</div>
              <div className="font-semibold text-gray-900">
                {powerStats.max.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Power Factor Pill */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-cyan-100/80 border border-cyan-200/50">
              <Gauge className="w-4 h-4 text-cyan-600" />
            </div>
            <span className="text-lg font-bold text-cyan-600">
              {powerFactorStats.current.toFixed(2)}
              <span className="text-sm font-normal ml-0.5">%</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Avg</div>
              <div className="font-semibold text-gray-900">
                {powerFactorStats.avg.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Min</div>
              <div className="font-semibold text-gray-900">
                {powerFactorStats.min.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 text-[10px]">Max</div>
              <div className="font-semibold text-gray-900">
                {powerFactorStats.max.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Chart */}
      {chartData.length > 0 ? (
        <EnvironmentChart initialData={chartData} />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No environment data available yet.
        </div>
      )}
    </div>
  );
}
