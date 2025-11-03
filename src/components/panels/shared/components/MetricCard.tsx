// src/components/panels/shared/components/MetricCard.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Stats } from "@/types";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  config: {
    key: string;
    name: string;
    unit: string;
    icon: LucideIcon;
    color: string;
    decimalPlaces: number;
  };
  stats: Stats;
  index: number;
  trend?: "up" | "down" | "stable";
  showTrend?: boolean;
}

const colorMap: { [key: string]: any } = {
  red: {
    bg: "bg-gradient-to-br from-red-50 to-orange-50 border border-red-200",
    iconBg: "bg-red-100/80 border border-red-200/50",
    iconColor: "text-red-600",
    textColor: "text-red-600",
    trendUpColor: "text-red-500",
    trendDownColor: "text-blue-500",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200",
    iconBg: "bg-blue-100/80 border border-blue-200/50",
    iconColor: "text-blue-600",
    textColor: "text-blue-600",
    trendUpColor: "text-blue-500",
    trendDownColor: "text-green-500",
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200",
    iconBg: "bg-green-100/80 border border-green-200/50",
    iconColor: "text-green-600",
    textColor: "text-green-600",
    trendUpColor: "text-green-500",
    trendDownColor: "text-red-500",
  },
  yellow: {
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200",
    iconBg: "bg-yellow-100/80 border border-yellow-200/50",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-600",
    trendUpColor: "text-yellow-500",
    trendDownColor: "text-green-500",
  },
  indigo: {
    bg: "bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200",
    iconBg: "bg-indigo-100/80 border border-indigo-200/50",
    iconColor: "text-indigo-600",
    textColor: "text-indigo-600",
    trendUpColor: "text-indigo-500",
    trendDownColor: "text-green-500",
  },
  cyan: {
    bg: "bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200",
    iconBg: "bg-cyan-100/80 border border-cyan-200/50",
    iconColor: "text-cyan-600",
    textColor: "text-cyan-600",
    trendUpColor: "text-cyan-500",
    trendDownColor: "text-green-500",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200",
    iconBg: "bg-purple-100/80 border border-purple-200/50",
    iconColor: "text-purple-600",
    textColor: "text-purple-600",
    trendUpColor: "text-purple-500",
    trendDownColor: "text-green-500",
  },
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200",
    iconBg: "bg-orange-100/80 border border-orange-200/50",
    iconColor: "text-orange-600",
    textColor: "text-orange-600",
    trendUpColor: "text-orange-500",
    trendDownColor: "text-green-500",
  },
  teal: {
    bg: "bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200",
    iconBg: "bg-teal-100/80 border border-teal-200/50",
    iconColor: "text-teal-600",
    textColor: "text-teal-600",
    trendUpColor: "text-teal-500",
    trendDownColor: "text-green-500",
  },
};

const getTrendIcon = (trend?: "up" | "down" | "stable", colors?: any) => {
  if (!trend) return null;

  if (trend === "up") {
    return (
      <TrendingUp
        className={`w-3 h-3 ${colors?.trendUpColor || "text-red-500"}`}
      />
    );
  }

  if (trend === "down") {
    return (
      <TrendingDown
        className={`w-3 h-3 ${colors?.trendDownColor || "text-green-500"}`}
      />
    );
  }

  return <Minus className="w-3 h-3 text-gray-400" />;
};

export default function MetricCard({
  config,
  stats,
  index,
  trend,
  showTrend = false,
}: MetricCardProps) {
  const colors = colorMap[config.color] || colorMap.green;
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.1,
      }}
      className={`${colors.bg} rounded-xl p-4 shadow-sm`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-xl ${colors.iconBg}`}>
          <IconComponent className={`w-4 h-4 ${colors.iconColor}`} />
        </div>
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${config.key}-current-${stats.current}`}
                initial={{
                  opacity: 0,
                  y: -15,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 15,
                  scale: 1.05,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className={`text-lg font-bold ${colors.textColor}`}
              >
                {stats.current.toFixed(config.decimalPlaces)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm font-normal">{config.unit}</span>
            {showTrend && trend && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${config.key}-trend-${trend}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {getTrendIcon(trend, colors)}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs">
        <div className="text-center">
          <div className="text-muted-foreground text-[10px]">Avg</div>
          <AnimatePresence mode="wait">
            <motion.div
              className="font-semibold text-gray-900"
              key={`${config.key}-avg-${stats.avg}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {stats.avg.toFixed(config.decimalPlaces)}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-[10px]">Min</div>
          <AnimatePresence mode="wait">
            <motion.div
              className="font-semibold text-gray-900"
              key={`${config.key}-min-${stats.min}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {stats.min.toFixed(config.decimalPlaces)}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground text-[10px]">Max</div>
          <AnimatePresence mode="wait">
            <motion.div
              className="font-semibold text-gray-900"
              key={`${config.key}-max-${stats.max}`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {stats.max.toFixed(config.decimalPlaces)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
