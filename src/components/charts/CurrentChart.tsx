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

// Custom tooltip for current chart
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
                {entry.value?.toFixed(3)}
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
        <Tooltip content={<CustomTooltip />} />
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
