// src/components/PowerCharts.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { ChartData, CurrentSensorData, Stats } from "@/types";
import { useEffect, useState, useCallback } from "react";

// Define proper types for tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    name: string;
    color: string;
    unit?: string;
  }>;
  label?: string;
}

// Define API response type
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

// Fixed CustomTooltip with proper types
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-700 rounded-lg p-3 shadow-lg z-50">
        <p className="font-medium text-gray-900 dark:text-white mb-2">
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}:{" "}
            <strong className="text-gray-900 dark:text-white">
              {entry.value.toFixed(entry.dataKey === "current" ? 3 : 1)}
              {entry.unit}
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface PowerChartsProps {
  data: ChartData[];
  currentData: CurrentSensorData;
}

export default function PowerCharts({ data, currentData }: PowerChartsProps) {
  const [chartData, setChartData] = useState<ChartData[]>(data || []);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update internal state when props change
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    }
  }, [data]);

  // Move calculateStats inside useCallback to fix dependency issue
  const calculateStats = useCallback(
    (key: keyof ChartData): Stats => {
      console.log(`🧮 Calculating stats for: ${key}`);

      const values = chartData
        .map((d) => {
          const value = d[key] as number;
          return typeof value === "number" && !isNaN(value) ? value : null;
        })
        .filter((v): v is number => v !== null);

      console.log(`📊 Stats calculation for ${key}:`, {
        valuesCount: values.length,
        valuesSample: values.slice(0, 5),
      });

      if (values.length === 0) {
        console.warn(`⚠️ No valid values found for ${key}, returning zeros`);
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

      console.log(`✅ Final stats for ${key}:`, stats);
      return stats;
    },
    [chartData]
  );

  const calculateDeltaDomain = useCallback(
    (key: keyof ChartData, delta: number = 2) => {
      const values = chartData
        .map((d) => d[key] as number)
        .filter((v) => !isNaN(v));

      if (values.length === 0) {
        console.log(`📏 Domain for ${key}: No data, using default [0, 10]`);
        return [0, 10];
      }

      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min;

      const effectiveDelta = Math.max(delta, range * 0.2);
      const domainMin = Math.max(0, Math.floor(min - effectiveDelta));
      const domainMax = Math.ceil(max + effectiveDelta);

      console.log(`📏 Domain for ${key}:`, {
        min,
        max,
        range,
        effectiveDelta,
        domain: [domainMin, domainMax],
      });
      return [domainMin, domainMax];
    },
    [chartData]
  );

  // Debug effect
  useEffect(() => {
    console.log("🔍 DEBUG - chartData updated:", {
      length: chartData.length,
      isEmpty: chartData.length === 0,
      firstRecord: chartData[0],
      lastRecord: chartData[chartData.length - 1],
      sampleValues: chartData.slice(0, 3).map((d) => ({
        time: d.time,
        power: d.power,
        temperature: d.temperature,
        voltage: d.voltage,
        current: d.current,
      })),
    });

    if (chartData.length > 0) {
      console.log("📈 DEBUG - Statistics calculation:", {
        powerStats: calculateStats("power"),
        tempStats: calculateStats("temperature"),
      });
    }
  }, [chartData, calculateStats]);

  // Fetch historical data from PostgreSQL via Prisma
  const fetchChartData = async () => {
    try {
      setLoading(true);
      console.log(
        "🔄 Fetching historical data from /api/sensor (PostgreSQL via Prisma)..."
      );
      const response = await fetch("/api/sensor?hours=24&limit=100");

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "❌ API response not OK:",
          response.status,
          response.statusText,
          errorText
        );
        throw new Error(
          `Failed to fetch historical data: ${response.status} ${response.statusText}`
        );
      }

      const data: ApiSensorReading[] = await response.json();
      console.log("📥 Historical data received from API:", {
        dataLength: data.length,
        dataTypes: data.length > 0 ? Object.keys(data[0]) : "no data",
        firstRecord: data[0],
        lastRecord: data[data.length - 1],
      });

      // Transform data with proper number conversion
      const transformedData: ChartData[] = data.map(
        (reading: ApiSensorReading, index: number) => {
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

      console.log("✅ Historical data transformed:", {
        totalRecords: transformedData.length,
        hasData: transformedData.length > 0,
      });

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
    console.log("🚀 PowerCharts component mounted - fetching initial data");

    // Only fetch if we don't have data from props
    if (!data || data.length === 0) {
      fetchChartData();
    }

    const chartDataInterval = setInterval(fetchChartData, 30000);

    return () => {
      clearInterval(chartDataInterval);
    };
  }, []);

  // Calculate stats
  const tempStats = calculateStats("temperature");
  const powerStats = calculateStats("power");
  const voltageStats = calculateStats("voltage");
  const currentStats = calculateStats("current");
  const apparentPowerStats = calculateStats("apparentPower");
  const reactivePowerStats = calculateStats("reactivePower");

  const tempDomain = calculateDeltaDomain("temperature", 2);
  const humidityDomain = calculateDeltaDomain("humidity", 5);

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
        <div className="text-lg">Loading sensor data...</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Power Analytics
        </h2>
        <div className="flex items-center gap-4">
          {error && <div className="text-sm text-red-600">⚠️ {error}</div>}
          {lastUpdate && (
            <div className="text-sm text-green-600">
              ✅ Live from Blynk • Last update:{" "}
              {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          title="Temperature"
          stats={tempStats}
          unit="°C"
          color="text-red-500"
        />
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
      </div>

      {/* Charts Grid - Only show if we have data */}
      {chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature & Humidity Chart */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Environment
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  domain={tempDomain}
                  tickFormatter={(value) => `${value}°C`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  domain={humidityDomain}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Temperature"
                  unit="°C"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  name="Humidity"
                  unit="%"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Power Consumption */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Power Consumption
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  domain={[0, "dataMax + 5"]}
                  tickFormatter={(value) => `${value}W`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Active Power"
                  unit="W"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Voltage Chart */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Voltage
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tickFormatter={(value) => `${value}V`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="voltage"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Voltage"
                  unit="V"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Current Chart */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Current
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  domain={[0, "dataMax + 0.02"]}
                  tickFormatter={(value) => `${value}A`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Current"
                  unit="A"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Power Analysis */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Power Analysis
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  domain={[0, "dataMax + 5"]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="power"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Active Power"
                  unit="W"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="apparentPower"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Apparent Power"
                  unit="VA"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="reactivePower"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Reactive Power"
                  unit="VAR"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          📊 No historical data available yet. Statistics and charts will appear
          when data is collected.
          <br />
          <span className="text-sm">
            Check if data is being saved to PostgreSQL via Prisma.
          </span>
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

      {/* Data Source Info */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        📊 Charts &amp; Statistics: {chartData.length} historical readings from
        PostgreSQL via Prisma • 🔴 Live values: Real-time from Blynk IoT
      </div>
    </div>
  );
}
