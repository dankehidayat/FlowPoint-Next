// src/components/panels/summary/hooks/useSmartRecommendations.ts
import { SensorData } from "@/types";
import {
  TrendingUp,
  TrendingDown,
  Zap,
  Fan,
  Wind,
  AirVent,
  Droplets,
  Sprout,
  CheckCircle2,
} from "lucide-react";

interface SmartRecommendation {
  text: string;
  icon: React.ReactNode;
  urgency: "low" | "medium" | "high";
  powerImpact: "low" | "medium" | "high";
  category: "temperature" | "humidity" | "energy" | "ventilation" | "trend";
}

type Trend = "up" | "down" | "stable";

export function useSmartRecommendations(
  data: SensorData,
  trends: { temp: Trend; humidity: Trend; power: Trend }
) {
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

  const recommendations = getSmartRecommendations();

  return { recommendations, getPowerImpactInfo };
}
