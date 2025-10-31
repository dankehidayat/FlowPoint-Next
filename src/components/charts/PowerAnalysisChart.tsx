// src/components/charts/PowerAnalysisChart.tsx
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

interface PowerAnalysisChartProps {
  initialData: ChartData[];
}

// Custom tooltip for power analysis chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg backdrop-blur-sm overflow-hidden">
        <div className="bg-muted/50 px-3 py-2 border-b border-border">
          <p className="text-sm text-foreground font-medium">{label}</p>
        </div>
        <div className="px-3 py-2 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-foreground">{entry.name}</span>
              </div>
              <span className="font-semibold text-foreground ml-4">
                {entry.value?.toFixed(entry.name === "Current" ? 3 : 1)}
                {entry.unit ? ` ${entry.unit}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function PowerAnalysisChart({
  initialData,
}: PowerAnalysisChartProps) {
  const [timeRange, setTimeRange] = useState<number>(24);
  const [chartData, setChartData] = useState<ChartData[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDataForTimeRange = async () => {
      if (timeRange <= 24) {
        // For 24 hours or less, use client-side filtering
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
          } else {
            // Fallback to initial data if no historical data
            setChartData(initialData || []);
          }
        } catch (error) {
          console.error("Failed to fetch power analysis data:", error);
          setChartData(initialData || []);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDataForTimeRange();
  }, [timeRange, initialData]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TimeRangeSelector onTimeRangeChange={setTimeRange} defaultRange={24} />
      </div>

      {isLoading ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading power data...</div>
        </div>
      ) : !chartData || chartData.length === 0 ? (
        <div className="h-[200px] flex items-center justify-center">
          <div className="text-muted-foreground">No power data available</div>
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
      )}
    </div>
  );
}
