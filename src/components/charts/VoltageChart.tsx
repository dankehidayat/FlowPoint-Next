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

interface VoltageChartProps {
  data: ChartData[];
}

export default function VoltageChart({ data }: VoltageChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
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
          domain={["dataMin - 1", "dataMax + 1"]}
          tickFormatter={(value) => `${value}V`}
        />
        <Tooltip />
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
  );
}
