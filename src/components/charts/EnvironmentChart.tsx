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

  return (
    <ChartContainer title="Environment" timeRange={timeRange}>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} tickMargin={10} />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickMargin={10}
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
