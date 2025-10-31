// src/components/EnergyCharts.tsx
"use client";

import { ChartData, SensorData, Stats } from "@/types";
import { useEffect, useState, useCallback } from "react";
import PowerConsumptionChart from "./charts/PowerConsumptionChart";
import VoltageChart from "./charts/VoltageChart";
import CurrentChart from "./charts/CurrentChart";
import PowerAnalysisChart from "./charts/PowerAnalysisChart";
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

interface ApiSensorReading {
  id: number;
  voltage: number | string;
  current: number | string;
  power: number | string;
  energy: number | string;
  frequency: number | string;
  powerFactor: number | string;
  apparentPower: number | string;
  reactivePower: number | string;
  temperature: number | string;
  humidity: number | string;
  timestamp: string;
}

interface EnergyChartsProps {
  data: ChartData[];
  currentData: SensorData;
}

export default function EnergyCharts({ data, currentData }: EnergyChartsProps) {
  const [chartData, setChartData] = useState<ChartData[]>(data || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    }
  }, [data]);

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

      // Special formatting for different metrics
      let decimalPlaces = 1;
      if (key === "current") decimalPlaces = 3;
      if (key === "powerFactor") decimalPlaces = 2;
      if (key === "energy") decimalPlaces = 2;
      if (key === "frequency") decimalPlaces = 1;

      return {
        min: parseFloat(min.toFixed(decimalPlaces)),
        max: parseFloat(max.toFixed(decimalPlaces)),
        avg: parseFloat(avg.toFixed(decimalPlaces)),
        current: parseFloat(current.toFixed(decimalPlaces)),
      };
    },
    [chartData]
  );

  // Fetch historical data from PostgreSQL via Prisma
  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/sensor?hours=24&limit=100");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch historical data: ${response.status} ${response.statusText}`
        );
      }

      const data: ApiSensorReading[] = await response.json();

      // Transform data with proper number conversion
      const transformedData: ChartData[] = data.map(
        (reading: ApiSensorReading) => {
          const transformed = {
            time: new Date(reading.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            voltage: Number(reading.voltage) || 0,
            current: Number(reading.current) || 0,
            power: Number(reading.power) || 0,
            energy: Number(reading.energy) || 0,
            frequency: Number(reading.frequency) || 0,
            powerFactor: Number(reading.powerFactor) || 0,
            apparentPower: Number(reading.apparentPower) || 0,
            reactivePower: Number(reading.reactivePower) || 0,
            temperature: Number(reading.temperature) || 0,
            humidity: Number(reading.humidity) || 0,
            timestamp: reading.timestamp,
          };

          return transformed;
        }
      );

      setChartData(transformedData);
      setError(null);
    } catch (error) {
      console.error("❌ Error fetching chart data:", error);
      setError("Failed to fetch historical data: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have data from props
    if (!data || data.length === 0) {
      fetchChartData();
    }

    const chartDataInterval = setInterval(fetchChartData, 30000);

    return () => {
      clearInterval(chartDataInterval);
    };
  }, []);

  // Calculate stats for all metrics
  const powerStats = calculateStats("power");
  const voltageStats = calculateStats("voltage");
  const currentStats = calculateStats("current");
  const apparentPowerStats = calculateStats("apparentPower");
  const reactivePowerStats = calculateStats("reactivePower");
  const powerFactorStats = calculateStats("powerFactor");
  const frequencyStats = calculateStats("frequency");
  const energyStats = calculateStats("energy");

  if (loading && chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading energy data...</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Energy Analytics
        </h2>
        {error && <div className="text-sm text-red-600">⚠️ {error}</div>}
      </div>

      {/* Statistics Panel - All energy metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Active Power Pill */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 border border-green-200 dark:border-green-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-green-100/80 dark:bg-green-900/50 border border-green-200/50 dark:border-green-700/30">
              <Plug className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {powerStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">W</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">{powerStats.avg.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">{powerStats.min.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">{powerStats.max.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Apparent Power Pill */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-yellow-100/80 dark:bg-yellow-900/50 border border-yellow-200/50 dark:border-yellow-700/30">
              <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {apparentPowerStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">VA</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">
                {apparentPowerStats.avg.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">
                {apparentPowerStats.min.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">
                {apparentPowerStats.max.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Reactive Power Pill */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/10 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-indigo-100/80 dark:bg-indigo-900/50 border border-indigo-200/50 dark:border-indigo-700/30">
              <CircleDashed className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {reactivePowerStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">VAR</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">
                {reactivePowerStats.avg.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">
                {reactivePowerStats.min.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">
                {reactivePowerStats.max.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Power Factor Pill */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/10 border border-cyan-200 dark:border-cyan-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-cyan-100/80 dark:bg-cyan-900/50 border border-cyan-200/50 dark:border-cyan-700/30">
              <Gauge className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
              {powerFactorStats.current.toFixed(2)}
              <span className="text-sm font-normal ml-0.5">%</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">
                {powerFactorStats.avg.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">
                {powerFactorStats.min.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">
                {powerFactorStats.max.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Voltage Pill */}
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/10 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-blue-100/80 dark:bg-blue-900/50 border border-blue-200/50 dark:border-blue-700/30">
              <Sigma className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {voltageStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">V</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">{voltageStats.avg.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">{voltageStats.min.toFixed(1)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">{voltageStats.max.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Current Pill */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/10 border border-purple-200 dark:border-purple-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-purple-100/80 dark:bg-purple-900/50 border border-purple-200/50 dark:border-purple-700/30">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {currentStats.current.toFixed(3)}
              <span className="text-sm font-normal ml-0.5">A</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">{currentStats.avg.toFixed(3)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">{currentStats.min.toFixed(3)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">{currentStats.max.toFixed(3)}</div>
            </div>
          </div>
        </div>

        {/* Frequency Pill */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-orange-100/80 dark:bg-orange-900/50 border border-orange-200/50 dark:border-orange-700/30">
              <Waves className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {frequencyStats.current.toFixed(1)}
              <span className="text-sm font-normal ml-0.5">Hz</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">
                {frequencyStats.avg.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">
                {frequencyStats.min.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">
                {frequencyStats.max.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Energy Pill */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/10 border border-teal-200 dark:border-teal-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-teal-100/80 dark:bg-teal-900/50 border border-teal-200/50 dark:border-teal-700/30">
              <Battery className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {energyStats.current.toFixed(2)}
              <span className="text-sm font-normal ml-0.5">Wh</span>
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Avg</div>
              <div className="font-semibold">{energyStats.avg.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Min</div>
              <div className="font-semibold">{energyStats.min.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="text-muted-foreground text-[10px]">Max</div>
              <div className="font-semibold">{energyStats.max.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid - Using individual chart components */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Power Consumption */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Power Consumption
            </h3>
            <PowerConsumptionChart data={chartData} />
          </div>

          {/* Voltage Chart */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Voltage
            </h3>
            <VoltageChart data={chartData} />
          </div>

          {/* Current Chart */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Current
            </h3>
            <CurrentChart data={chartData} />
          </div>

          {/* Power Analysis */}
          <div className="lg:col-span-2">
            <PowerAnalysisChart initialData={chartData} />
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No historical energy data available yet.
        </div>
      )}

      {/* Simplified Data Source Info */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Charts & Statistics: {chartData.length} historical readings from Prisma
        + PostgreSQL
      </div>
    </div>
  );
}
