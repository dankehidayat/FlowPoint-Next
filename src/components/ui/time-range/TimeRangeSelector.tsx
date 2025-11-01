// src/components/ui/time-range/TimeRangeSelector.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
  { label: "1H", value: 1 },
  { label: "6H", value: 6 },
  { label: "12H", value: 12 },
  { label: "1D", value: 24 },
  { label: "1W", value: 168 },
];

export default function TimeRangeSelector({
  onTimeRangeChange,
  defaultRange = 1, // Changed default to 1H
  className = "",
}: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<number>(defaultRange);

  const handleRangeChange = (hours: number) => {
    setSelectedRange(hours);
    onTimeRangeChange(hours);
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`
              relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
              ${
                selectedRange === range.value
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            {selectedRange === range.value && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-white shadow-sm border border-gray-200 rounded-md"
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
