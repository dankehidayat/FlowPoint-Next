// src/components/SummaryDashboard.tsx
"use client";

import { SensorData } from "@/types";
import { useState, useEffect } from "react";
import {
  Thermometer,
  Droplets,
  Zap,
  Battery,
  AlertTriangle,
  CheckCircle2,
  Wind,
  TrendingUp,
  TrendingDown,
  Eye,
  Activity,
  Gauge,
  Clock,
  Fan,
  AirVent,
  Sprout,
  Lightbulb,
} from "lucide-react";

interface SummaryDashboardProps {
  data: SensorData;
}

interface ComfortStatus {
  level: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  recommendation: string;
  urgency: "low" | "medium" | "high";
}

interface SmartRecommendation {
  text: string;
  icon: React.ReactNode;
  urgency: "low" | "medium" | "high";
  powerImpact: "low" | "medium" | "high";
  category: "temperature" | "humidity" | "energy" | "ventilation" | "trend";
}

type Trend = "up" | "down" | "stable";

export default function SummaryDashboard({ data }: SummaryDashboardProps) {
  const [previousData, setPreviousData] = useState(data);
  const [trends, setTrends] = useState<{
    temp: Trend;
    humidity: Trend;
    power: Trend;
  }>({
    temp: "stable",
    humidity: "stable",
    power: "stable",
  });

  useEffect(() => {
    const newTrends = {
      temp: (data.temperature > previousData.temperature
        ? "up"
        : data.temperature < previousData.temperature
        ? "down"
        : "stable") as Trend,
      humidity: (data.humidity > previousData.humidity
        ? "up"
        : data.humidity < previousData.humidity
        ? "down"
        : "stable") as Trend,
      power: (data.power > previousData.power
        ? "up"
        : data.power < previousData.power
        ? "down"
        : "stable") as Trend,
    };
    setTrends(newTrends);
    setPreviousData(data);
  }, [data, previousData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getOverallComfort = (): ComfortStatus => {
    const temp = data.temperature;
    const humidity = data.humidity;

    // Simple comfort calculation
    let comfortScore = 0.7; // Base score

    // Temperature scoring
    if (temp >= 20 && temp <= 24) comfortScore += 0.2;
    else if (temp >= 18 && temp <= 26) comfortScore += 0.1;
    else if (temp < 16 || temp > 28) comfortScore -= 0.3;

    // Humidity scoring
    if (humidity >= 40 && humidity <= 60) comfortScore += 0.2;
    else if (humidity >= 30 && humidity <= 70) comfortScore += 0.1;
    else if (humidity < 25 || humidity > 75) comfortScore -= 0.3;

    if (comfortScore >= 0.8) {
      return {
        level: "Excellent",
        color: "text-green-600",
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        border: "border-green-200",
        icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        recommendation: "Perfect conditions! Maintain current environment.",
        urgency: "low",
      };
    } else if (comfortScore >= 0.6) {
      return {
        level: "Good",
        color: "text-blue-600",
        bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
        border: "border-blue-200",
        icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />,
        recommendation: "Comfortable conditions. Minor adjustments possible.",
        urgency: "low",
      };
    } else if (comfortScore >= 0.4) {
      return {
        level: "Fair",
        color: "text-orange-500",
        bg: "bg-gradient-to-r from-orange-50 to-amber-50",
        border: "border-orange-200",
        icon: <Wind className="w-6 h-6 text-orange-500" />,
        recommendation: "Some discomfort. Consider adjustments.",
        urgency: "medium",
      };
    } else {
      return {
        level: "Poor",
        color: "text-red-600",
        bg: "bg-gradient-to-r from-red-50 to-orange-50",
        border: "border-red-200",
        icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        recommendation:
          "Uncomfortable conditions. Immediate action recommended.",
        urgency: "high",
      };
    }
  };

  const getSmartRecommendations = (): SmartRecommendation[] => {
    const recommendations: SmartRecommendation[] = [];
    const temp = data.temperature;
    const humidity = data.humidity;

    if (trends.temp === "up" && temp >= 24) {
      recommendations.push({
        text: "Temperature rising - consider pre-cooling with AC",
        icon: <TrendingUp className="w-4 h-4 text-purple-600" />,
        urgency: "medium",
        powerImpact: "high",
        category: "trend",
      });
    } else if (trends.temp === "down" && temp <= 18) {
      recommendations.push({
        text: "Temperature falling - prepare heating system",
        icon: <TrendingDown className="w-4 h-4 text-blue-600" />,
        urgency: "medium",
        powerImpact: "high",
        category: "trend",
      });
    }

    if (trends.humidity === "up" && humidity >= 60) {
      recommendations.push({
        text: "Humidity increasing - activate dehumidification",
        icon: <TrendingUp className="w-4 h-4 text-blue-600" />,
        urgency: "medium",
        powerImpact: "medium",
        category: "trend",
      });
    } else if (trends.humidity === "down" && humidity <= 30) {
      recommendations.push({
        text: "Humidity decreasing - consider humidifier",
        icon: <TrendingDown className="w-4 h-4 text-green-600" />,
        urgency: "medium",
        powerImpact: "low",
        category: "trend",
      });
    }

    if (temp >= 28) {
      recommendations.push({
        text: "Turn on AC system",
        icon: <Zap className="w-4 h-4 text-red-600" />,
        urgency: "high",
        powerImpact: "high",
        category: "temperature",
      });
      recommendations.push({
        text: "Use ceiling fans for circulation",
        icon: <Fan className="w-4 h-4 text-blue-600" />,
        urgency: "medium",
        powerImpact: "low",
        category: "temperature",
      });
    } else if (temp >= 26) {
      recommendations.push({
        text: "Turn on portable fan",
        icon: <Wind className="w-4 h-4 text-orange-600" />,
        urgency: "medium",
        powerImpact: "low",
        category: "temperature",
      });
      recommendations.push({
        text: "Open windows for cross-ventilation",
        icon: <AirVent className="w-4 h-4 text-green-600" />,
        urgency: "low",
        powerImpact: "low",
        category: "ventilation",
      });
    } else if (temp <= 16) {
      recommendations.push({
        text: "Turn on heating system",
        icon: <Zap className="w-4 h-4 text-red-600" />,
        urgency: "high",
        powerImpact: "high",
        category: "temperature",
      });
    } else if (temp <= 18) {
      recommendations.push({
        text: "Use space heater",
        icon: <Zap className="w-4 h-4 text-orange-600" />,
        urgency: "medium",
        powerImpact: "medium",
        category: "temperature",
      });
    }

    if (humidity >= 70) {
      recommendations.push({
        text: "Turn on dehumidifier",
        icon: <Droplets className="w-4 h-4 text-blue-600" />,
        urgency: "high",
        powerImpact: "medium",
        category: "humidity",
      });
    } else if (humidity >= 60) {
      recommendations.push({
        text: "Improve room ventilation",
        icon: <AirVent className="w-4 h-4 text-green-600" />,
        urgency: "low",
        powerImpact: "low",
        category: "ventilation",
      });
    } else if (humidity <= 25) {
      recommendations.push({
        text: "Turn on humidifier",
        icon: <Droplets className="w-4 h-4 text-blue-600" />,
        urgency: "high",
        powerImpact: "low",
        category: "humidity",
      });
    } else if (humidity <= 35) {
      recommendations.push({
        text: "Use portable humidifier",
        icon: <Sprout className="w-4 h-4 text-green-600" />,
        urgency: "medium",
        powerImpact: "low",
        category: "humidity",
      });
    }

    if (temp >= 20 && temp <= 24 && humidity >= 40 && humidity <= 60) {
      recommendations.push({
        text: "Ideal conditions - no AC/heater needed",
        icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
        urgency: "low",
        powerImpact: "low",
        category: "energy",
      });
    }

    if (data.power > 150) {
      recommendations.push({
        text: "High power usage - optimize appliances",
        icon: <Zap className="w-4 h-4 text-yellow-600" />,
        urgency: "medium",
        powerImpact: "high",
        category: "energy",
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        text: "All systems operating efficiently",
        icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
        urgency: "low",
        powerImpact: "low",
        category: "energy",
      });
    }

    return recommendations
      .sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 };
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
      })
      .slice(0, 6);
  };

  const getPowerImpactInfo = (impact: "low" | "medium" | "high") => {
    switch (impact) {
      case "low":
        return {
          color: "text-green-600 bg-green-100",
          text: "LOW",
        };
      case "medium":
        return {
          color: "text-yellow-600 bg-yellow-100",
          text: "MED",
        };
      case "high":
        return {
          color: "text-red-600 bg-red-100",
          text: "HIGH",
        };
      default:
        return {
          color: "text-gray-600 bg-gray-100",
          text: "LOW",
        };
    }
  };

  const getEnergyMetrics = () => {
    let powerFactor = 0;
    if (data.apparentPower > 0) {
      powerFactor = (data.power / data.apparentPower) * 100;
    }
    powerFactor = Math.max(0, Math.min(100, powerFactor));

    const dailyEstimate = data.energy * 24;

    return {
      powerFactor,
      dailyEstimate,
      efficiency:
        powerFactor > 85
          ? "Excellent"
          : powerFactor > 70
          ? "Good"
          : powerFactor > 50
          ? "Fair"
          : "Poor",
    };
  };

  const overallComfort = getOverallComfort();
  const recommendations = getSmartRecommendations();
  const energyMetrics = getEnergyMetrics();

  // Get icon background color based on comfort level
  const getComfortIconBg = () => {
    switch (overallComfort.level) {
      case "Excellent":
        return "bg-green-100/80 border border-green-200/50";
      case "Good":
        return "bg-blue-100/80 border border-blue-200/50";
      case "Fair":
        return "bg-orange-100/80 border border-orange-200/50";
      case "Poor":
        return "bg-red-100/80 border border-red-200/50";
      default:
        return "bg-gray-100/80 border border-gray-200/50";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreeting()}!
          </h2>
          <p className="text-gray-600 text-lg">
            Current environment is{" "}
            <span className={`font-semibold ${overallComfort.color}`}>
              {overallComfort.level.toLowerCase()}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${overallComfort.bg} ${overallComfort.border} border`}
          >
            <span className={overallComfort.color}>Live</span>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Main Status Card */}
      <div
        className={`rounded-xl p-6 mb-6 border-2 ${overallComfort.border} ${overallComfort.bg} transition-all duration-500`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl ${getComfortIconBg()}`}>
              {overallComfort.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Comfort Status
              </h3>
              <p className={`text-2xl font-bold ${overallComfort.color} mb-1`}>
                {overallComfort.level}
              </p>
              <p className="text-gray-600 text-sm max-w-md">
                {overallComfort.recommendation}
              </p>
            </div>
          </div>
          <div className="text-right hidden lg:block">
            <div className="text-sm text-gray-500 mb-2">Current Readings</div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 justify-end">
                <Thermometer className="w-4 h-4 text-red-500" />
                <span className="text-gray-900">
                  {data.temperature.toFixed(1)}°C
                </span>
                {trends.temp !== "stable" &&
                  (trends.temp === "up" ? (
                    <TrendingUp className="w-4 h-4 text-red-500 trend-animation" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-blue-500 trend-animation" />
                  ))}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className="text-gray-900">
                  {data.humidity.toFixed(1)}%
                </span>
                {trends.humidity !== "stable" &&
                  (trends.humidity === "up" ? (
                    <TrendingUp className="w-4 h-4 text-blue-500 trend-animation" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-500 trend-animation" />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Environment Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            Environment Metrics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Temperature */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-red-100/80 border border-red-200/50">
                  <Thermometer className="w-5 h-5 text-red-500" />
                </div>
                {trends.temp !== "stable" && (
                  <div
                    className={`text-xs ${
                      trends.temp === "up" ? "text-red-500" : "text-blue-500"
                    } trend-animation`}
                  >
                    {trends.temp === "up" ? "↗" : "↘"}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {data.temperature.toFixed(1)}°C
              </div>
              <div className="text-xs text-gray-500">Temperature</div>
            </div>

            {/* Humidity */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                {trends.humidity !== "stable" && (
                  <div
                    className={`text-xs ${
                      trends.humidity === "up"
                        ? "text-blue-500"
                        : "text-green-500"
                    } trend-animation`}
                  >
                    {trends.humidity === "up" ? "↗" : "↘"}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {data.humidity.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">Humidity</div>
            </div>
          </div>

          {/* Comfort Indicators */}
          <div className="grid grid-cols-2 gap-4">
            {/* Thermal Comfort */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-orange-100/80 border border-orange-200/50">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Thermal Comfort
                </span>
              </div>
              <div className="flex-1 flex items-center">
                <div className="text-lg font-semibold text-gray-900">
                  {data.temperature < 18
                    ? "Cool"
                    : data.temperature < 26
                    ? "Ideal"
                    : "Warm"}
                </div>
              </div>
            </div>

            {/* Humidity Level */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-cyan-100/80 border border-cyan-200/50">
                  <Droplets className="w-5 h-5 text-cyan-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Humidity Level
                </span>
              </div>
              <div className="flex-1 flex items-center">
                <div className="text-lg font-semibold text-gray-900">
                  {data.humidity < 30
                    ? "Dry"
                    : data.humidity < 70
                    ? "Comfortable"
                    : "Humid"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="p-2 rounded-xl bg-yellow-100/80 border border-yellow-200/50">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            Energy Metrics
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Active Power */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-green-100/80 border border-green-200/50">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                {trends.power !== "stable" && (
                  <div
                    className={`text-xs ${
                      trends.power === "up"
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {trends.power === "up" ? "↗" : "↘"}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {data.power.toFixed(1)}W
              </div>
              <div className="text-xs text-gray-500">Active Power</div>
            </div>

            {/* Power Factor */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-purple-100/80 border border-purple-200/50">
                  <Gauge className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {energyMetrics.powerFactor.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">Power Factor</div>
            </div>
          </div>

          {/* Additional Energy Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Energy Consumed */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-amber-100/80 border border-amber-200/50">
                  <Battery className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Energy Used
                </span>
              </div>
              <div className="flex-1 flex items-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {data.energy.toFixed(2)} Wh
                  </div>
                  <div className="text-xs text-gray-500">
                    {(data.energy / 1000).toFixed(4)} kWh
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Estimate */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-4 flex flex-col h-full min-h-[120px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-sky-100/80 border border-sky-200/50">
                  <Clock className="w-5 h-5 text-sky-500" />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Daily Estimate
                </span>
              </div>
              <div className="flex-1 flex items-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    {(energyMetrics.dailyEstimate / 1000).toFixed(2)} kWh
                  </div>
                  <div className="text-xs text-gray-500">Projected 24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Smart Recommendations with Trends */}
      <div className="border border-blue-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-blue-100/80 border border-blue-200/50">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              Smart Recommendations & Trend Analysis
            </h3>
            <p className="text-sm text-gray-600">
              AI-powered suggestions based on current conditions and trends
            </p>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => {
            const powerInfo = getPowerImpactInfo(rec.powerImpact);
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        rec.category === "trend"
                          ? "bg-purple-100/80 border border-purple-200/50"
                          : rec.category === "temperature"
                          ? "bg-red-100/80 border border-red-200/50"
                          : rec.category === "humidity"
                          ? "bg-blue-100/80 border border-blue-200/50"
                          : rec.category === "energy"
                          ? "bg-yellow-100/80 border border-yellow-200/50"
                          : "bg-green-100/80 border border-green-200/50"
                      }`}
                    >
                      {rec.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {rec.text}
                      </h4>
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${powerInfo.color}`}
                  >
                    {powerInfo.text}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        rec.urgency === "high"
                          ? "bg-red-500"
                          : rec.urgency === "medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-500 capitalize">
                      {rec.category}
                    </span>
                  </div>
                  {rec.category === "trend" && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      Trend
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
