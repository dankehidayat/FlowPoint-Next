// src/components/ui/charts/tooltips/ChartTooltip.tsx
"use client";

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueFormatter?: (value: number, name: string) => string;
  unitMapper?: (name: string) => string;
}

// Default unit mapping for different data keys
const defaultUnitMapper = (name: string): string => {
  const unitMap: { [key: string]: string } = {
    // Power related
    power: "W",
    apparentPower: "VA",
    reactivePower: "VAR",
    energy: "Wh",

    // Electrical
    voltage: "V",
    current: "A",
    frequency: "Hz",
    powerFactor: "%",

    // Environment
    temperature: "°C",
    humidity: "%",

    // Default names
    "Active Power": "W",
    "Apparent Power": "VA",
    "Reactive Power": "VAR",
    "Energy Used": "Wh",
    Voltage: "V",
    Current: "A",
    Frequency: "Hz",
    "Power Factor": "%",
    Temperature: "°C",
    Humidity: "%",
  };

  return unitMap[name] || "";
};

// Default value formatter
const defaultValueFormatter = (value: number, name: string): string => {
  const decimalPlaces: { [key: string]: number } = {
    current: 3,
    powerFactor: 2,
    energy: 2,
    Current: 3,
    "Power Factor": 2,
    "Energy Used": 2,
  };

  const decimals = decimalPlaces[name] || 1;
  return value.toFixed(decimals);
};

export default function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = defaultValueFormatter,
  unitMapper = defaultUnitMapper,
}: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-lg shadow-2xl overflow-hidden">
      {/* Frosted glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-100/5 dark:to-gray-100/0 rounded-lg pointer-events-none" />

      <div className="relative bg-gradient-to-r from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-700/20 px-3 py-2 border-b border-white/20 dark:border-gray-600/20">
        <p className="text-sm text-gray-900 dark:text-white font-medium drop-shadow-sm">
          {label}
        </p>
      </div>
      <div className="relative px-3 py-2 space-y-1">
        {payload.map((entry: any, index: number) => {
          const unit = unitMapper(entry.dataKey || entry.name);
          const formattedValue = valueFormatter(
            entry.value,
            entry.dataKey || entry.name
          );

          return (
            <div
              key={index}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 border border-white/50"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-900 dark:text-white font-medium drop-shadow-sm">
                  {entry.name}
                </span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white ml-4 drop-shadow-sm">
                {formattedValue}
                {unit ? ` ${unit}` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
