// src/components/panels/summary/hooks/useComfortStatus.ts
import { SensorData } from "@/types";
import { CheckCircle2, Wind, AlertTriangle } from "lucide-react";

interface ComfortStatus {
  level: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
  recommendation: string;
  urgency: "low" | "medium" | "high";
}

export function useComfortStatus(data: SensorData) {
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

  const getComfortIconBg = () => {
    const level = getOverallComfort().level;
    switch (level) {
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

  const overallComfort = getOverallComfort();

  return { overallComfort, getComfortIconBg };
}
