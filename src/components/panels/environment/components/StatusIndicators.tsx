// src/components/panels/environment/components/StatusIndicators.tsx
"use client";

import { EnvironmentStatus } from "../hooks/useEnvironmentStatus";

interface StatusIndicatorsProps {
  temperatureStatus: EnvironmentStatus["temperatureStatus"];
  humidityStatus: EnvironmentStatus["humidityStatus"];
}

export default function StatusIndicators({
  temperatureStatus,
  humidityStatus,
}: StatusIndicatorsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
        <span className="text-muted-foreground">Temp Status</span>
        <span className={`font-medium ${temperatureStatus.color}`}>
          {temperatureStatus.level}
        </span>
      </div>
      <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
        <span className="text-muted-foreground">Humidity Status</span>
        <span className={`font-medium ${humidityStatus.color}`}>
          {humidityStatus.level}
        </span>
      </div>
    </div>
  );
}
