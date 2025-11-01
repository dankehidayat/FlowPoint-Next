// src/app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import SummaryAnalytics from "@/components/panels/summary/SummaryAnalytics";
import EnvironmentAnalytics from "@/components/panels/environment/EnvironmentAnalytics";
import EnergyAnalytics from "@/components/panels/energy/EnergyAnalytics";
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

// Fetch historical chart data based on time range
const fetchChartData = async (hours: number): Promise<ChartData[]> => {
  try {
    console.log(`📈 Fetching chart data for ${hours} hours...`);

    const response = await fetch(`/api/sensor?hours=${hours}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 API Response received:", data);

    let chartData: ChartData[] = [];

    // Handle different response formats
    if (Array.isArray(data)) {
      // Direct array format - transform to ChartData
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
      // Object format with success/error fields
      if (data.success === false) {
        throw new Error(data.error || "Failed to fetch chart data");
      }

      // Handle data field
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
      } else if (Array.isArray(data)) {
        // Data is directly an array in the response object
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
      }
    }

    console.log(
      `✅ Loaded ${chartData.length} historical data points for ${hours}h range`
    );
    return chartData;
  } catch (error) {
    console.error("❌ Error fetching chart data:", error);

    // Return empty array as fallback
    return [];
  }
};

export default function Dashboard() {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [timeRange, setTimeRange] = useState<number>(1); // Default to 1H

  // Update interval based on time range
  const getUpdateInterval = useCallback((hours: number): number => {
    switch (hours) {
      case 1:
        return 2000; // 2 seconds for 1H - real-time updates
      case 6:
        return 5000; // 5 seconds for 6H
      case 12:
        return 10000; // 10 seconds for 12H
      case 24:
        return 15000; // 15 seconds for 1D
      case 168:
        return 30000; // 30 seconds for 1W
      default:
        return 5000;
    }
  }, []);

  // Load historical data when time range changes
  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        console.log(`📈 Loading historical data for ${timeRange} hours`);
        const historicalData = await fetchChartData(timeRange);
        setChartData(historicalData);
      } catch (error) {
        console.error("Error loading historical data:", error);
        // Don't clear existing data on error, keep what we have
      }
    };

    loadHistoricalData();
  }, [timeRange]);

  // Real-time updates
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("🚀 Initializing dashboard data...");

        const initialData = await fetchBlynkData();
        setSensorData(initialData);
        setLastUpdate(new Date().toLocaleTimeString());

        // Load initial chart data
        const historicalData = await fetchChartData(timeRange);
        setChartData(historicalData);

        console.log("✅ Dashboard initialized successfully");
      } catch (error) {
        const errorMsg = "Failed to fetch data from Blynk server";
        setError(errorMsg);
        console.error(errorMsg, error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    const interval = getUpdateInterval(timeRange);
    console.log(
      `🔄 Setting update interval to ${interval}ms for ${timeRange}h range`
    );

    const updateInterval = setInterval(async () => {
      try {
        console.log("🔄 Updating real-time data...");
        const newData = await fetchBlynkData();
        setSensorData(newData);
        setLastUpdate(new Date().toLocaleTimeString());
        setError(null);

        // Smooth chart updates - only add new data points
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

          // For short time ranges, maintain a reasonable number of points
          const maxPoints = timeRange <= 6 ? 100 : timeRange <= 24 ? 200 : 500;

          if (prev.length >= maxPoints) {
            // Remove oldest point and add new one (sliding window)
            return [...prev.slice(1), newChartPoint];
          }

          // Just add the new point
          return [...prev, newChartPoint];
        });

        console.log("✅ Real-time data updated successfully");
      } catch (error) {
        const errorMsg = "Failed to update data from Blynk server";
        setError(errorMsg);
        console.error(errorMsg, error);
      }
    }, interval);

    return () => clearInterval(updateInterval);
  }, [timeRange, getUpdateInterval]);

  const handleTimeRangeChange = (hours: number) => {
    console.log(`🕒 Time range changed to ${hours} hours`);
    setTimeRange(hours);
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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
          </div>
        </header>

        {/* Summary Analytics */}
        <SummaryAnalytics data={sensorData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Environment Analytics */}
          <div className="lg:col-span-1">
            <EnvironmentAnalytics
              data={sensorData}
              chartData={chartData}
              timeRange={timeRange}
            />
          </div>

          {/* Energy Analytics */}
          <div className="lg:col-span-2">
            <EnergyAnalytics
              data={chartData}
              currentData={sensorData}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
