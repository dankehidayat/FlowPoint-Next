// src/types/analytics.ts
export interface MetricStats {
  min: number;
  max: number;
  avg: number;
  current: number;
}

export interface MetricConfig {
  key: string;
  name: string;
  unit: string;
  icon: React.ComponentType<any>;
  color: string;
  decimalPlaces: number;
}

export interface AnalyticsPanelProps {
  timeRange: number;
  onTimeRangeChange: (hours: number) => void;
}
