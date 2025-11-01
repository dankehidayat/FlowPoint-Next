// src/components/charts/CurrentChart.tsx
"use client";

import {
  AreaChart,
  Area,
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

interface CurrentChartProps {
  data: ChartData[];
  timeRange: number;
}

export default function CurrentChart({ data, timeRange }: CurrentChartProps) {
  return (
    <ChartContainer
      title="Current"
      timeRange={timeRange}
      isEmpty={!data || data.length === 0}
      emptyMessage="No current data available"
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
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
              domain={[0, "dataMax + 0.02"]}
              label={{
                value: "Current (A)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
                style: { fontSize: 12 },
              }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              strokeWidth={2}
              name="Current"
              dot={false}
              isAnimationActive={true}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
