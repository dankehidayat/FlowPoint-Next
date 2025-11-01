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
    <div className="material-tooltip">
      <div className="material-tooltip-label">{label}</div>
      <div className="material-tooltip-list">
        {payload.map((entry: any, index: number) => {
          const unit = unitMapper(entry.dataKey || entry.name);
          const formattedValue = valueFormatter(
            entry.value,
            entry.dataKey || entry.name
          );

          return (
            <div key={index} className="material-tooltip-item">
              <div
                className="material-tooltip-dot"
                style={{ backgroundColor: entry.color }}
              />
              <span className="material-tooltip-name">{entry.name}</span>
              <span className="material-tooltip-value">
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
