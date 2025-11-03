// src/components/charts/EnvironmentChart.tsx
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
} from "recharts";
import { ChartData } from "@/types";
import ChartContainer from "../ui/charts/common/ChartContainer";
import ChartTooltip from "../ui/charts/tooltips/ChartTooltip";

interface EnvironmentChartProps {
  data: ChartData[];
  timeRange: number;
  isLoading?: boolean;
}

export default function EnvironmentChart({
  data,
  timeRange,
  isLoading = false,
}: EnvironmentChartProps) {
  if (isLoading) {
    return (
      <ChartContainer
        title="Environment"
        timeRange={timeRange}
        isLoading={true}
        loadingMessage="Loading environment data..."
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer
        title="Environment"
        timeRange={timeRange}
        isEmpty={true}
        emptyMessage="No environment data available"
      />
    );
  }

  const chartData = data.map((item) => ({
    ...item,
    temperature: Number(item.temperature) || 0,
    humidity: Number(item.humidity) || 0,
  }));

  // Calculate ranges for better axis scaling
  const temperatures = chartData.map((d) => d.temperature).filter(Boolean);
  const humidities = chartData.map((d) => d.humidity).filter(Boolean);

  const tempMin = temperatures.length > 0 ? Math.min(...temperatures) : 0;
  const tempMax = temperatures.length > 0 ? Math.max(...temperatures) : 30;
  const humidityMin = humidities.length > 0 ? Math.min(...humidities) : 0;
  const humidityMax = humidities.length > 0 ? Math.max(...humidities) : 100;

  // Add padding to ranges
  const tempPadding = Math.max(2, (tempMax - tempMin) * 0.1);
  const humidityPadding = Math.max(5, (humidityMax - humidityMin) * 0.1);

  return (
    <ChartContainer title="Environment" timeRange={timeRange}>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[tempMin - tempPadding, tempMax + tempPadding]}
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                style: { fontSize: 12 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={[
                Math.max(0, humidityMin - humidityPadding),
                Math.min(100, humidityMax + humidityPadding),
              ]}
              label={{
                value: "Humidity (%)",
                angle: -90,
                position: "insideRight",
                offset: -10,
                style: { fontSize: 12 },
              }}
            />
            <Tooltip content={<ChartTooltip />} />
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
              isAnimationActive={true}
              animationDuration={300}
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
              isAnimationActive={true}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
