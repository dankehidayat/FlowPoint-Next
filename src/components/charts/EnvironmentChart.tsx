// src/components/charts/EnvironmentChart.tsx
"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartData } from "@/types";
import TimeRangeSelector from "../TimeRangeSelector";

interface EnvironmentChartProps {
  initialData: ChartData[];
}

export default function EnvironmentChart({
  initialData,
}: EnvironmentChartProps) {
  const [timeRange, setTimeRange] = useState<number>(24);
  const [chartData, setChartData] = useState<ChartData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDataForTimeRange = async () => {
      if (timeRange <= 24) {
        // For 24 hours or less, use client-side filtering from initial data
        const cutoffTime = new Date(Date.now() - timeRange * 60 * 60 * 1000);
        const filteredData = (initialData || []).filter(
          (item) => new Date(item.timestamp) >= cutoffTime
        );
        setChartData(filteredData);
      } else {
        // For longer ranges, fetch aggregated data from API
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/sensor?hours=${timeRange}&aggregated=true`
          );
          const result = await response.json();

          if (result.historical) {
            // Transform aggregated data to ChartData format
            const transformedData = result.historical.map((item: any) => ({
              time: new Date(item.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                ...(timeRange > 24 && { month: "short", day: "numeric" }),
              }),
              timestamp: item.timestamp,
              temperature: item.temperature_avg || item.temperature,
              humidity: item.humidity_avg || item.humidity,
              power: item.power_avg || item.power,
              apparentPower: item.apparentPower_avg || item.apparentPower,
              reactivePower: item.reactivePower_avg || item.reactivePower,
              voltage: item.voltage_avg || item.voltage,
              current: item.current_avg || item.current,
              energy: item.energy_last || item.energy,
              frequency: item.frequency_avg || item.frequency,
              powerFactor: item.powerFactor_avg || item.powerFactor,
            }));
            setChartData(transformedData);
          }
        } catch (error) {
          console.error("Failed to fetch environment data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDataForTimeRange();
  }, [timeRange, initialData]);

  // Calculate domains with larger delta to separate the lines
  const calculateDomains = () => {
    if (chartData.length === 0) {
      return { tempDomain: [0, 40], humidityDomain: [0, 100] };
    }

    const temperatures = chartData
      .map((d) => d.temperature)
      .filter((t) => !isNaN(t));
    const humidities = chartData
      .map((d) => d.humidity)
      .filter((h) => !isNaN(h));

    const tempMin = Math.min(...temperatures);
    const tempMax = Math.max(...temperatures);
    const humidityMin = Math.min(...humidities);
    const humidityMax = Math.max(...humidities);

    // Larger delta for temperature (8-10 degrees) to create more separation
    const tempDelta = Math.max(8, (tempMax - tempMin) * 0.5);
    const humidityDelta = Math.max(15, (humidityMax - humidityMin) * 0.4);

    return {
      tempDomain: [
        Math.max(0, Math.floor(tempMin - tempDelta)),
        Math.ceil(tempMax + tempDelta),
      ],
      humidityDomain: [
        Math.max(0, Math.floor(humidityMin - humidityDelta)),
        Math.min(100, Math.ceil(humidityMax + humidityDelta)),
      ],
    };
  };

  const { tempDomain, humidityDomain } = calculateDomains();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TimeRangeSelector onTimeRangeChange={setTimeRange} defaultRange={24} />
      </div>

      {isLoading ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-muted-foreground">
            Loading environment data...
          </div>
        </div>
      ) : !chartData || chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-muted-foreground">
            No environment data available
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
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
            <Tooltip />
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
      )}
    </div>
  );
}
