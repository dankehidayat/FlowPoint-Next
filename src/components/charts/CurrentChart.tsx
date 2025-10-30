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

interface CurrentChartProps {
  data: ChartData[];
}

export default function CurrentChart({ data }: CurrentChartProps) {
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
          domain={[0, "dataMax + 0.02"]}
          tickFormatter={(value) => `${value}A`}
        />
        <Tooltip />
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
  );
}
