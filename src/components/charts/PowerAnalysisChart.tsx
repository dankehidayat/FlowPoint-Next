// src/components/charts/PowerAnalysisChart.tsx
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
import ChartTooltip from "@/components/ui/charts/tooltips/ChartTooltip";
import ChartContainer from "@/components/ui/charts/common/ChartContainer";
import { formatTimeLabel } from "@/lib/chart-utils";

interface PowerAnalysisChartProps {
  initialData: ChartData[];
  timeRange: number;
}

export default function PowerAnalysisChart({
  initialData,
  timeRange,
}: PowerAnalysisChartProps) {
  const chartData = initialData.map((item) => ({
    time: item.time,
    timestamp: item.timestamp,
    power: item.power,
    apparentPower: item.apparentPower,
    reactivePower: item.reactivePower,
  }));

  return (
    <ChartContainer
      title="Power Analysis"
      timeRange={timeRange}
      isEmpty={!initialData || initialData.length === 0}
      emptyMessage="No power analysis data available"
    >
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 12 }}
              className="fill-gray-500"
              interval="preserveStartEnd"
              tickFormatter={(time) => formatTimeLabel(time, timeRange)}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="fill-gray-500"
              label={{
                value: "Power (W/VA/VAR)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                style: { fontSize: 12 },
              }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="power"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Active Power"
              isAnimationActive={true}
              animationDuration={300}
            />
            <Line
              type="monotone"
              dataKey="apparentPower"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Apparent Power"
              isAnimationActive={true}
              animationDuration={300}
            />
            <Line
              type="monotone"
              dataKey="reactivePower"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
              name="Reactive Power"
              isAnimationActive={true}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
