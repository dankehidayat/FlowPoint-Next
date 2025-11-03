// src/components/ui/time-range/TimeRangeSelector.tsx
"use client";

import { useState, useEffect } from "react";
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
  { label: "1H", value: 1 },
  { label: "6H", value: 6 },
  { label: "12H", value: 12 },
  { label: "1D", value: 24 },
  { label: "1W", value: 168 },
];

export default function TimeRangeSelector({
  onTimeRangeChange,
  defaultRange = 1,
  className = "",
}: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState<number>(defaultRange);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitial(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRangeChange = (hours: number) => {
    setSelectedRange(hours);
    onTimeRangeChange(hours);
  };

  return (
    <motion.div
      className={`flex items-center space-x-1 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex bg-muted/50 rounded-lg p-1 border border-border">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeChange(range.value)}
            className={`
              relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
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
                className="absolute inset-0 bg-background shadow-sm border border-border rounded-md"
                initial={isInitial ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
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
    </motion.div>
  );
}
