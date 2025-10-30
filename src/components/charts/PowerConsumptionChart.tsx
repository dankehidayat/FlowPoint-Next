// src/components/charts/PowerConsumptionChart.tsx
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

interface PowerConsumptionChartProps {
  data: ChartData[];
}

export default function PowerConsumptionChart({
  data,
}: PowerConsumptionChartProps) {
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
          domain={[0, "dataMax + 5"]}
          tickFormatter={(value) => `${value}W`}
        />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="power"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.3}
          strokeWidth={2}
          name="Active Power"
          unit="W"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
