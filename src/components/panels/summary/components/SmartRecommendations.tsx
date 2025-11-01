// src/components/panels/summary/components/SmartRecommendations.tsx
"use client";

import { Lightbulb } from "lucide-react";

interface SmartRecommendationsProps {
  recommendations: any[];
  getPowerImpactInfo: (impact: "low" | "medium" | "high") => any;
}

export default function SmartRecommendations({
  recommendations,
  getPowerImpactInfo,
}: SmartRecommendationsProps) {
  return (
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
  );
}
