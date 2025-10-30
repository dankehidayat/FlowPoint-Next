// src/components/EnergyCharts.tsx
"use client";

import { ChartData, SensorData, Stats } from "@/types";
import { useEffect, useState, useCallback } from "react";
import PowerConsumptionChart from "./charts/PowerConsumptionChart";
import VoltageChart from "./charts/VoltageChart";
import CurrentChart from "./charts/CurrentChart";
import PowerAnalysisChart from "./charts/PowerAnalysisChart";

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

      const stats = {
        min: parseFloat(min.toFixed(1)),
        max: parseFloat(max.toFixed(1)),
        avg: parseFloat(avg.toFixed(1)),
        current: parseFloat(current.toFixed(key === "current" ? 3 : 1)),
      };

      return stats;
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

  // Calculate stats - only power related
  const powerStats = calculateStats("power");
  const voltageStats = calculateStats("voltage");
  const currentStats = calculateStats("current");
  const apparentPowerStats = calculateStats("apparentPower");
  const reactivePowerStats = calculateStats("reactivePower");

  const StatCard = ({
    title,
    stats,
    unit,
    color,
  }: {
    title: string;
    stats: Stats;
    unit: string;
    color: string;
  }) => (
    <div className="bg-card border rounded-lg p-3">
      <div className="text-sm text-muted-foreground font-medium mb-2">
        {title}
      </div>
      <div className="flex justify-between text-xs">
        <div className="text-center">
          <div className="text-muted-foreground">Current</div>
          <div className={`font-semibold text-sm ${color}`}>
            {stats.current.toFixed(stats.current < 1 ? 3 : 1)}
            {unit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">Average</div>
          <div className="font-semibold text-sm">
            {stats.avg.toFixed(1)}
            {unit}
          </div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">Range</div>
          <div className="font-semibold text-sm">
            {stats.min.toFixed(1)}/{stats.max.toFixed(1)}
            {unit}
          </div>
        </div>
      </div>
    </div>
  );

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

      {/* Statistics Panel - Power only */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          title="Power"
          stats={powerStats}
          unit="W"
          color="text-green-500"
        />
        <StatCard
          title="Voltage"
          stats={voltageStats}
          unit="V"
          color="text-blue-500"
        />
        <StatCard
          title="Current"
          stats={currentStats}
          unit="A"
          color="text-purple-500"
        />
        <StatCard
          title="Apparent Power"
          stats={apparentPowerStats}
          unit="VA"
          color="text-yellow-500"
        />
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
            <PowerAnalysisChart initialData={chartData} />{" "}
            {/* Fixed: changed data to initialData */}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No historical energy data available yet.
        </div>
      )}

      {/* Current Values Display */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Active Power</div>
          <div className="text-lg font-semibold text-green-500">
            {currentData.power.toFixed(1)} W
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Apparent Power</div>
          <div className="text-lg font-semibold text-yellow-500">
            {currentData.apparentPower.toFixed(2)} VA
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Reactive Power</div>
          <div className="text-lg font-semibold text-purple-500">
            {currentData.reactivePower.toFixed(2)} VAR
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Power Factor</div>
          <div className="text-lg font-semibold text-blue-500">
            {currentData.powerFactor.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Additional Current Values */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Voltage</div>
          <div className="text-lg font-semibold text-blue-500">
            {currentData.voltage.toFixed(1)} V
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Current</div>
          <div className="text-lg font-semibold text-purple-500">
            {currentData.current.toFixed(3)} A
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Frequency</div>
          <div className="text-lg font-semibold text-orange-500">
            {currentData.frequency.toFixed(1)} Hz
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Energy</div>
          <div className="text-lg font-semibold text-cyan-500">
            {currentData.energy.toFixed(2)} Wh
          </div>
        </div>
      </div>

      {/* Simplified Data Source Info */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Charts & Statistics: {chartData.length} historical readings from
        PostgreSQL
      </div>
    </div>
  );
}
