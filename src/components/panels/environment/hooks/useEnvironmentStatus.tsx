// src/components/panels/environment/hooks/useEnvironmentStatus.ts
import { SensorData } from "@/types";

export interface EnvironmentStatus {
  temperatureStatus: {
    level: "High" | "Warm" | "Normal" | "Cool";
    color: string;
  };
  humidityStatus: {
    level: "High" | "Low" | "Normal";
    color: string;
  };
}

export function useEnvironmentStatus(data: SensorData): EnvironmentStatus {
  const getTemperatureStatus = () => {
    if (data.temperature > 30) {
      return { level: "High" as const, color: "text-red-600" };
    } else if (data.temperature > 25) {
      return { level: "Warm" as const, color: "text-yellow-600" };
    } else if (data.temperature < 18) {
      return { level: "Cool" as const, color: "text-blue-600" };
    } else {
      return { level: "Normal" as const, color: "text-green-600" };
    }
  };

  const getHumidityStatus = () => {
    if (data.humidity > 80) {
      return { level: "High" as const, color: "text-blue-600" };
    } else if (data.humidity < 30) {
      return { level: "Low" as const, color: "text-yellow-600" };
    } else {
      return { level: "Normal" as const, color: "text-green-600" };
    }
  };

  return {
    temperatureStatus: getTemperatureStatus(),
    humidityStatus: getHumidityStatus(),
  };
}
