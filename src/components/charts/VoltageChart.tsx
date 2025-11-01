// src/components/charts/VoltageChart.tsx
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

interface VoltageChartProps {
  data: ChartData[];
  timeRange: number;
}

export default function VoltageChart({ data, timeRange }: VoltageChartProps) {
  return (
    <ChartContainer
      title="Voltage"
      timeRange={timeRange}
      isEmpty={!data || data.length === 0}
      emptyMessage="No voltage data available"
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
              domain={["dataMin - 1", "dataMax + 1"]}
              label={{
                value: "Voltage (V)",
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
              dataKey="voltage"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              name="Voltage"
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
