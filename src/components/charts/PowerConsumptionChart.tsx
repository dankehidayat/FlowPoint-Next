// src/components/charts/PowerConsumptionChart.tsx
"use client";

import { motion } from "framer-motion";
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

interface PowerConsumptionChartProps {
  data: ChartData[];
  timeRange: number;
}

export default function PowerConsumptionChart({
  data,
  timeRange,
}: PowerConsumptionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      key={`power-chart-${timeRange}`}
    >
      <ChartContainer
        title="Power Consumption"
        timeRange={timeRange}
        isEmpty={!data || data.length === 0}
        emptyMessage="No power consumption data available"
      >
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200"
              />
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
                domain={[0, "dataMax + 5"]}
                label={{
                  value: "Power (W)",
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
                dataKey="power"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Active Power"
                dot={false}
                isAnimationActive={true}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </motion.div>
  );
}
