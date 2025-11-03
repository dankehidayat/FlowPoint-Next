export interface SensorData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerFactor: number;
  apparentPower: number;
  reactivePower: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
}

export interface CurrentSensorData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerFactor: number;
  apparentPower: number;
  reactivePower: number;
  temperature: number;
  humidity: number;
}

export interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
  power: number;
  apparentPower: number;
  reactivePower: number;
  voltage: number;
  current: number;
  energy: number;
  frequency: number;
  powerFactor: number;
  timestamp: string; // Should be string for serialization
}

export interface Stats {
  min: number;
  max: number;
  avg: number;
  current: number;
}

// Add this to your existing src/types/index.ts file
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
