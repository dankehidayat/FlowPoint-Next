// src/components/EnvironmentPanel.tsx
"use client";

import { SensorData, ChartData } from "@/types";
import EnvironmentAnalytics from "./EnvironmentAnalytics";

interface EnvironmentPanelProps {
  data: SensorData;
  chartData: ChartData[];
}

export default function EnvironmentPanel({
  data,
  chartData,
}: EnvironmentPanelProps) {
  const getTemperatureColor = (temp: number) => {
    if (temp < 18)
      return {
        bgColor: "bg-blue-500",
        textColor: "text-blue-500",
        gaugeColor: "from-blue-400 to-blue-600",
      };
    if (temp < 26)
      return {
        bgColor: "bg-green-500",
        textColor: "text-green-500",
        gaugeColor: "from-green-400 to-green-600",
      };
    return {
      bgColor: "bg-red-500",
      textColor: "text-red-500",
      gaugeColor: "from-red-400 to-red-600",
    };
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30)
      return {
        bgColor: "bg-orange-500",
        textColor: "text-orange-500",
        gaugeColor: "from-orange-400 to-orange-600",
      };
    if (humidity < 70)
      return {
        bgColor: "bg-green-500",
        textColor: "text-green-500",
        gaugeColor: "from-green-400 to-green-600",
      };
    return {
      bgColor: "bg-blue-500",
      textColor: "text-blue-500",
      gaugeColor: "from-blue-400 to-blue-600",
    };
  };

  const getTemperatureLevel = (temp: number) => {
    const min = 10;
    const max = 40;
    return Math.min(100, Math.max(0, ((temp - min) / (max - min)) * 100));
  };

  const getHumidityLevel = (humidity: number) => {
    return Math.min(100, Math.max(0, humidity));
  };

  const tempColors = getTemperatureColor(data.temperature);
  const humidityColors = getHumidityColor(data.humidity);

  return (
    <div className="space-y-6">
      {/* Environment Status Card */}
      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Environment Status
        </h2>

        {/* Temperature Gauge */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground font-medium">
              Temperature
            </span>
            <span className={`text-lg font-semibold ${tempColors.textColor}`}>
              {data.temperature.toFixed(1)}°C
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${tempColors.gaugeColor} transition-all duration-1000 ease-out`}
              style={{ width: `${getTemperatureLevel(data.temperature)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>10°C</span>
            <span>25°C</span>
            <span>40°C</span>
          </div>
        </div>

        {/* Humidity Gauge */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground font-medium">Humidity</span>
            <span
              className={`text-lg font-semibold ${humidityColors.textColor}`}
            >
              {data.humidity.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${humidityColors.gaugeColor} transition-all duration-1000 ease-out`}
              style={{ width: `${getHumidityLevel(data.humidity)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`text-center p-3 rounded-lg border ${tempColors.bgColor.replace(
              "bg-",
              "bg-"
            )}20 ${tempColors.textColor} border-current/30`}
          >
            <div className="font-medium text-sm">Thermal Comfort</div>
            <div className="text-xs mt-1">
              {data.temperature < 18
                ? "Cool"
                : data.temperature < 26
                ? "Ideal"
                : "Warm"}
            </div>
          </div>
          <div
            className={`text-center p-3 rounded-lg border ${humidityColors.bgColor.replace(
              "bg-",
              "bg-"
            )}20 ${humidityColors.textColor} border-current/30`}
          >
            <div className="font-medium text-sm">Humidity Level</div>
            <div className="text-xs mt-1">
              {data.humidity < 30
                ? "Dry"
                : data.humidity < 70
                ? "Comfortable"
                : "Humid"}
            </div>
          </div>
        </div>
      </div>

      {/* Environment Analytics */}
      <EnvironmentAnalytics data={chartData} currentData={data} />
    </div>
  );
}
