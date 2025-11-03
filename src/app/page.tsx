// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SummaryAnalytics from "@/components/panels/summary/SummaryAnalytics";
import EnvironmentAnalytics from "@/components/panels/environment/EnvironmentAnalytics";
import EnergyAnalytics from "@/components/panels/energy/EnergyAnalytics";
import { SensorData, ChartData } from "@/types";
import { api } from "@/lib/api";

const fetchBlynkData = async (): Promise<SensorData> => {
  const baseTime = new Date();

  try {
    const data = await api.getBlynkData();

    if (data.error) {
      throw new Error(data.error);
    }

    const hasValidData = Object.values(data).some(
      (val) => val !== 0 && val !== null && val !== undefined
    );

    if (!hasValidData) {
      console.warn("⚠️ All data values are zero - Blynk server might be down");
    }

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

    return sensorData;
  } catch (error) {
    console.error("❌ Error in fetchBlynkData:", error);

    return {
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
  }
};

const fetchChartData = async (hours: number): Promise<ChartData[]> => {
  try {
    const response = await fetch(`/api/sensor?hours=${hours}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let chartData: ChartData[] = [];

    if (Array.isArray(data)) {
      chartData = data.map((item: any) => ({
        time: new Date(item.timestamp).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        temperature: Number(item.temperature) || 0,
        humidity: Number(item.humidity) || 0,
        power: Number(item.power) || 0,
        apparentPower: Number(item.apparentPower) || 0,
        reactivePower: Number(item.reactivePower) || 0,
        voltage: Number(item.voltage) || 0,
        current: Number(item.current) || 0,
        energy: Number(item.energy) || 0,
        frequency: Number(item.frequency) || 0,
        powerFactor: Number(item.powerFactor) || 0,
        timestamp: item.timestamp,
      }));
    } else if (data && typeof data === "object") {
      if (data.success === false) {
        throw new Error(data.error || "Failed to fetch chart data");
      }

      if (data.data && Array.isArray(data.data)) {
        chartData = data.data.map((item: any) => ({
          time: new Date(item.timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          temperature: Number(item.temperature) || 0,
          humidity: Number(item.humidity) || 0,
          power: Number(item.power) || 0,
          apparentPower: Number(item.apparentPower) || 0,
          reactivePower: Number(item.reactivePower) || 0,
          voltage: Number(item.voltage) || 0,
          current: Number(item.current) || 0,
          energy: Number(item.energy) || 0,
          frequency: Number(item.frequency) || 0,
          powerFactor: Number(item.powerFactor) || 0,
          timestamp: item.timestamp,
        }));
      }
    }

    return chartData;
  } catch (error) {
    console.error("❌ Error fetching chart data:", error);
    return [];
  }
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<number>(1);

  const getUpdateInterval = useCallback((hours: number): number => {
    switch (hours) {
      case 1:
        return 2000;
      case 6:
        return 5000;
      case 12:
        return 10000;
      case 24:
        return 15000;
      case 168:
        return 30000;
      default:
        return 5000;
    }
  }, []);

  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        const historicalData = await fetchChartData(timeRange);
        setChartData(historicalData);
      } catch (error) {
        console.error("Error loading historical data:", error);
      }
    };

    loadHistoricalData();
  }, [timeRange]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const initialData = await fetchBlynkData();
        setSensorData(initialData);

        const historicalData = await fetchChartData(timeRange);
        setChartData(historicalData);
      } catch (error) {
        setError("Failed to fetch data from Blynk server");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    const interval = getUpdateInterval(timeRange);

    const updateInterval = setInterval(async () => {
      try {
        const newData = await fetchBlynkData();
        setSensorData(newData);
        setError(null);

        setChartData((prev) => {
          const newChartPoint: ChartData = {
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
          };

          const maxPoints = timeRange <= 6 ? 100 : timeRange <= 24 ? 200 : 500;

          if (prev.length >= maxPoints) {
            return [...prev.slice(1), newChartPoint];
          }

          return [...prev, newChartPoint];
        });
      } catch (error) {
        setError("Failed to update data from Blynk server");
        console.error(error);
      }
    }, interval);

    return () => clearInterval(updateInterval);
  }, [timeRange, getUpdateInterval]);

  const handleTimeRangeChange = (hours: number) => {
    setTimeRange(hours);
  };

  const retryFetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newData = await fetchBlynkData();
      setSensorData(newData);
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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              Flowpoint
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Real-time Energy & Environment Monitoring
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-sm text-destructive bg-destructive/10 px-3 py-1 rounded"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SummaryAnalytics data={sensorData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Analytics Dashboard
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Comprehensive environment and energy monitoring
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-10">
              <div className="xl:col-span-4 p-6 border-r border-gray-200">
                <EnvironmentAnalytics
                  data={sensorData}
                  chartData={chartData}
                  timeRange={timeRange}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              </div>

              <div className="xl:col-span-6 p-6">
                <EnergyAnalytics
                  data={chartData}
                  currentData={sensorData}
                  timeRange={timeRange}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
