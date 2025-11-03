// src/components/panels/shared/components/AnalyticsHeader.tsx
"use client";

import { motion } from "framer-motion";
import TimeRangeSelector from "@/components/ui/time-range/TimeRangeSelector";

interface AnalyticsHeaderProps {
  title: string;
  description: string;
  timeRange: number;
  onTimeRangeChange: (hours: number) => void;
}

export default function AnalyticsHeader({
  title,
  description,
  timeRange,
  onTimeRangeChange,
}: AnalyticsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <TimeRangeSelector
        onTimeRangeChange={onTimeRangeChange}
        defaultRange={timeRange}
      />
    </motion.div>
  );
}
