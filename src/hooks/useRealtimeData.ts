// src/hooks/useRealtimeChartData.ts
import { useState, useEffect, useRef, useCallback } from "react";
import {
  SensorReading,
  getSensorDataSince,
  getAggregatedSensorData,
} from "@/lib/sensor-service";

interface UseRealtimeChartDataProps {
  initialData: any[];
  timeRange: number;
  updateInterval?: number;
  maxDataPoints?: number;
}

export function useRealtimeChartData({
  initialData,
  timeRange,
  updateInterval = 5000,
  maxDataPoints = 200,
}: UseRealtimeChartDataProps) {
  const [chartData, setChartData] = useState<any[]>(initialData);
  const [isUpdating, setIsUpdating] = useState(false);
  const lastTimestampRef = useRef<Date | null>(null);
  const initialLoadRef = useRef(true);

  // Initialize last timestamp
  useEffect(() => {
    if (initialData.length > 0 && initialLoadRef.current) {
      const lastItem = initialData[initialData.length - 1];
      lastTimestampRef.current = new Date(lastItem.timestamp);
      initialLoadRef.current = false;
    }
  }, [initialData]);

  // Smooth data appending
  const appendNewData = useCallback(
    (newData: any[]) => {
      if (newData.length === 0) return;

      setChartData((prevData) => {
        const dataMap = new Map();

        // Add existing data
        prevData.forEach((item) => {
          dataMap.set(item.timestamp, item);
        });

        // Add new data
        newData.forEach((item) => {
          dataMap.set(item.timestamp, item);
        });

        const mergedData = Array.from(dataMap.values())
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .slice(-maxDataPoints);

        return mergedData;
      });

      // Update last timestamp
      const latestItem = newData[newData.length - 1];
      if (latestItem?.timestamp) {
        lastTimestampRef.current = new Date(latestItem.timestamp);
      }
    },
    [maxDataPoints]
  );

  // Fetch incremental updates
  const fetchNewData = useCallback(async () => {
    if (isUpdating || !lastTimestampRef.current) return;

    setIsUpdating(true);
    try {
      const newData = await getSensorDataSince(lastTimestampRef.current);
      if (newData.length > 0) {
        console.log(`🔄 Adding ${newData.length} new data points`);
        appendNewData(newData);
      }
    } catch (error) {
      console.error("Error fetching new data:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, appendNewData]);

  // Refresh entire dataset
  const refreshData = useCallback(async () => {
    setIsUpdating(true);
    try {
      const newData = await getAggregatedSensorData(timeRange);
      const formattedData = newData.map((item) => ({
        ...item,
        time: new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: item.timestamp.toISOString(),
      }));

      setChartData(formattedData);

      if (formattedData.length > 0) {
        const lastItem = formattedData[formattedData.length - 1];
        lastTimestampRef.current = new Date(lastItem.timestamp);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [timeRange]);

  // Set up real-time updates for recent data
  useEffect(() => {
    if (timeRange <= 24) {
      const interval = setInterval(fetchNewData, updateInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNewData, updateInterval, timeRange]);

  // Refresh when time range changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    chartData,
    isUpdating,
    refreshData,
    lastTimestamp: lastTimestampRef.current,
  };
}
