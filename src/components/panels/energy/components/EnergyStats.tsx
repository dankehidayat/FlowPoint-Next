// src/components/panels/energy/components/EnergyStats.tsx
"use client";

import {
  Zap,
  Gauge,
  Sigma,
  CircleDashed,
  Activity,
  Waves,
  Battery,
  Plug,
} from "lucide-react";

interface EnergyStatsProps {
  stats: {
    power: any;
    voltage: any;
    current: any;
    apparentPower: any;
    reactivePower: any;
    powerFactor: any;
    frequency: any;
    energy: any;
  };
}

export default function EnergyStats({ stats }: EnergyStatsProps) {
  const statCards = [
    {
      key: "power",
      icon: Plug,
      color: "green",
      unit: "W",
      stats: stats.power,
      name: "Active Power",
    },
    {
      key: "apparentPower",
      icon: Zap,
      color: "yellow",
      unit: "VA",
      stats: stats.apparentPower,
      name: "Apparent Power",
    },
    {
      key: "reactivePower",
      icon: CircleDashed,
      color: "indigo",
      unit: "VAR",
      stats: stats.reactivePower,
      name: "Reactive Power",
    },
    {
      key: "powerFactor",
      icon: Gauge,
      color: "cyan",
      unit: "%",
      stats: stats.powerFactor,
      name: "Power Factor",
    },
    {
      key: "voltage",
      icon: Sigma,
      color: "blue",
      unit: "V",
      stats: stats.voltage,
      name: "Voltage",
    },
    {
      key: "current",
      icon: Activity,
      color: "purple",
      unit: "A",
      stats: stats.current,
      name: "Current",
    },
    {
      key: "frequency",
      icon: Waves,
      color: "orange",
      unit: "Hz",
      stats: stats.frequency,
      name: "Frequency",
    },
    {
      key: "energy",
      icon: Battery,
      color: "teal",
      unit: "Wh",
      stats: stats.energy,
      name: "Energy",
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: any } = {
      green: {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200",
        iconBg: "bg-green-100/80 border border-green-200/50",
        iconColor: "text-green-600",
        textColor: "text-green-600",
      },
      yellow: {
        bg: "bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200",
        iconBg: "bg-yellow-100/80 border border-yellow-200/50",
        iconColor: "text-yellow-600",
        textColor: "text-yellow-600",
      },
      indigo: {
        bg: "bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200",
        iconBg: "bg-indigo-100/80 border border-indigo-200/50",
        iconColor: "text-indigo-600",
        textColor: "text-indigo-600",
      },
      cyan: {
        bg: "bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200",
        iconBg: "bg-cyan-100/80 border border-cyan-200/50",
        iconColor: "text-cyan-600",
        textColor: "text-cyan-600",
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200",
        iconBg: "bg-blue-100/80 border border-blue-200/50",
        iconColor: "text-blue-600",
        textColor: "text-blue-600",
      },
      purple: {
        bg: "bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200",
        iconBg: "bg-purple-100/80 border border-purple-200/50",
        iconColor: "text-purple-600",
        textColor: "text-purple-600",
      },
      orange: {
        bg: "bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200",
        iconBg: "bg-orange-100/80 border border-orange-200/50",
        iconColor: "text-orange-600",
        textColor: "text-orange-600",
      },
      teal: {
        bg: "bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200",
        iconBg: "bg-teal-100/80 border border-teal-200/50",
        iconColor: "text-teal-600",
        textColor: "text-teal-600",
      },
    };

    return colorMap[color] || colorMap.green;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card) => {
        const colors = getColorClasses(card.color);
        const IconComponent = card.icon;
        const decimalPlaces =
          card.key === "current" ? 3 : card.key === "powerFactor" ? 2 : 1;

        return (
          <div
            key={card.key}
            className={`${colors.bg} rounded-xl p-4 shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-xl ${colors.iconBg}`}>
                <IconComponent className={`w-4 h-4 ${colors.iconColor}`} />
              </div>
              <span className={`text-lg font-bold ${colors.textColor}`}>
                {card.stats.current.toFixed(decimalPlaces)}
                <span className="text-sm font-normal ml-0.5">{card.unit}</span>
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <div className="text-center">
                <div className="text-muted-foreground text-[10px]">Avg</div>
                <div className="font-semibold">
                  {card.stats.avg.toFixed(decimalPlaces)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-[10px]">Min</div>
                <div className="font-semibold">
                  {card.stats.min.toFixed(decimalPlaces)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground text-[10px]">Max</div>
                <div className="font-semibold">
                  {card.stats.max.toFixed(decimalPlaces)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
