// src/components/TimeRangeSelector.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TimeRangeOption {
  label: string;
  value: number; // hours
}

interface TimeRangeSelectorProps {
  onTimeRangeChange: (hours: number) => void;
  defaultRange?: number;
  className?: string;
}

const timeRanges: TimeRangeOption[] = [
  { label: "6H", value: 6 },
  { label: "12H", value: 12 },
  { label: "1D", value: 24 },
  { label: "1W", value: 168 },
];

export default function TimeRangeSelector({
  onTimeRangeChange,
  defaultRange = 24,
  className = "",
}: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<number>(defaultRange);

  const handleRangeChange = (hours: number) => {
    setSelectedRange(hours);
    onTimeRangeChange(hours);
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        Time Range:
      </span>
      <div className="flex bg-muted/50 rounded-lg p-1 border">
        {timeRanges.map((range, index) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`
              relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
              ${
                selectedRange === range.value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {selectedRange === range.value && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-background shadow-sm border rounded-md"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10 whitespace-nowrap">
              {range.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
