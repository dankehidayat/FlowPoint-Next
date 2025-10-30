// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import SummaryDashboard from "@/components/SummaryDashboard";
import EnvironmentPanel from "@/components/EnvironmentPanel";
import EnergyCharts from "@/components/EnergyCharts";
import { SensorData, ChartData } from "@/types";
import { api } from "@/lib/api";

// Function to fetch ALREADY CALIBRATED data from our API route
const fetchBlynkData = async (): Promise<SensorData> => {
  const baseTime = new Date();

  try {
    console.log("🔄 Fetching data from /api/blynk...");

    const data = await api.getBlynkData();
    console.log("✅ Raw Blynk data received:", data);

    // If there's an error in the response, throw it
    if (data.error) {
      throw new Error(data.error);
    }

    // Check if we have valid data (not all zeros)
    const hasValidData = Object.values(data).some(
      (val) => val !== 0 && val !== null && val !== undefined
    );

    if (!hasValidData) {
      console.warn("⚠️ All data values are zero - Blynk server might be down");
    }

    // DIRECTLY USE THE CALIBRATED VALUES FROM ARDUINO - NO CALIBRATION NEEDED
    const sensorData: SensorData = {
      voltage: parseFloat((data.voltage || 0).toFixed(1)),
      current: parseFloat((data.current || 0).toFixed(3)),
      power: parseFloat((data.power || 0).toFixed(1)),
      energy: parseFloat((data.energy || 0).toFixed(2)),
      frequency: parseFloat((data.frequency || 0).toFixed(1)),
      powerFactor: parseFloat((data.powerFactor || 0).toFixed(2)),
      apparentPower: parseFloat((data.apparentPower || 0).toFixed(2)),
      reactivePower: parseFloat((data.reactivePower || 0).toFixed(2)),
      temperature: parseFloat((data.temperature || 0).toFixed(1)),
      humidity: parseFloat((data.humidity || 0).toFixed(1)),
      timestamp: baseTime,
    };

    console.log("📊 Processed sensor data:", sensorData);
    return sensorData;
  } catch (error) {
    console.error("❌ Error in fetchBlynkData:", error);

    // Return fallback data instead of throwing
    const fallbackData: SensorData = {
      voltage: 0,
      current: 0,
      power: 0,
      energy: 0,
      frequency: 0,
      powerFactor: 0,
      apparentPower: 0,
      reactivePower: 0,
      temperature: 0,
      humidity: 0,
      timestamp: baseTime,
    };

    return fallbackData;
  }
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Initializing dashboard data...");

        const initialData = await fetchBlynkData();
        setSensorData(initialData);
        setLastUpdate(new Date().toLocaleTimeString());

        // Initialize chart with current calibrated data
        const initialChartData: ChartData[] = Array.from(
          { length: 20 },
          (_, i) => {
            const time = new Date();
            time.setMinutes(time.getMinutes() - (19 - i));
            return {
              time: time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              temperature: initialData.temperature,
              humidity: initialData.humidity,
              power: initialData.power,
              apparentPower: initialData.apparentPower,
              reactivePower: initialData.reactivePower,
              voltage: initialData.voltage,
              current: initialData.current,
              energy: initialData.energy,
              frequency: initialData.frequency,
              powerFactor: initialData.powerFactor,
              timestamp: time.toISOString(),
            };
          }
        );
        setChartData(initialChartData);

        console.log("Dashboard initialized successfully");
      } catch (error) {
        const errorMsg = "Failed to fetch data from Blynk server";
        setError(errorMsg);
        console.error(errorMsg, error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    // Update data every 5 seconds
    const interval = setInterval(async () => {
      try {
        console.log("Updating data...");
        const newData = await fetchBlynkData();
        setSensorData(newData);
        setLastUpdate(new Date().toLocaleTimeString());
        setError(null);

        // Update chart data with calibrated values
        setChartData((prev) => {
          const newChartData: ChartData[] = [
            ...prev.slice(1),
            {
              time: newData.timestamp.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              temperature: newData.temperature,
              humidity: newData.humidity,
              power: newData.power,
              apparentPower: newData.apparentPower,
              reactivePower: newData.reactivePower,
              voltage: newData.voltage,
              current: newData.current,
              energy: newData.energy,
              frequency: newData.frequency,
              powerFactor: newData.powerFactor,
              timestamp: newData.timestamp.toISOString(),
            },
          ];
          return newChartData;
        });

        console.log("Data updated successfully");
      } catch (error) {
        const errorMsg = "Failed to update data from Blynk server";
        setError(errorMsg);
        console.error(errorMsg, error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const retryFetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newData = await fetchBlynkData();
      setSensorData(newData);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      setError("Failed to fetch data after retry");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !sensorData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-lg">
            Loading Flowpoint Dashboard...
          </p>
          <p className="text-sm text-muted-foreground">
            Fetching data from sensors...
          </p>
        </div>
      </div>
    );
  }

  if (error && !sensorData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-destructive text-lg mb-4">{error}</div>
          <p className="text-muted-foreground mb-4">
            Cannot connect to sensor data server.
          </p>
          <button
            onClick={retryFetch}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!sensorData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Flowpoint</h1>
            <p className="text-muted-foreground">
              Real-time Energy & Environment Monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-1 rounded">
                {error}
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg bg-card hover:bg-accent border transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* Summary Dashboard */}
        <SummaryDashboard data={sensorData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Environment Panel */}
          <div className="lg:col-span-1">
            <EnvironmentPanel data={sensorData} chartData={chartData} />
          </div>

          {/* Energy Charts */}
          <div className="lg:col-span-2">
            <EnergyCharts data={chartData} currentData={sensorData} />
          </div>
        </div>
      </div>
    </div>
  );
}
