// src/components/panels/energy/hooks/useEnergyData.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { ChartData } from "@/types";
import {
  getAggregatedSensorData,
  getSensorDataSince,
} from "@/lib/sensor-service";

export function useEnergyData(initialData: ChartData[], timeRange: number) {
  const [chartData, setChartData] = useState<ChartData[]>(initialData);
  const [loading, setLoading] = useState(
    !initialData || initialData.length === 0
  );
  const [error, setError] = useState<string | null>(null);
  const lastTimestampRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialData.length > 0) {
      const lastItem = initialData[initialData.length - 1];
      lastTimestampRef.current = lastItem.timestamp;
      setChartData(initialData);
    }
  }, [initialData]);

  const appendNewData = useCallback((newData: ChartData[]) => {
    if (newData.length === 0) return;

    setChartData((prevData) => {
      const dataMap = new Map();

      prevData.forEach((item) => dataMap.set(item.timestamp, item));
      newData.forEach((item) => dataMap.set(item.timestamp, item));

      const mergedData = Array.from(dataMap.values())
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        .slice(-200);

      return mergedData;
    });

    const latestItem = newData[newData.length - 1];
    if (latestItem?.timestamp) {
      lastTimestampRef.current = latestItem.timestamp;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sensorData = await getAggregatedSensorData(timeRange);

        const formattedData = sensorData.map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: item.timestamp.toISOString(),
          voltage: item.voltage,
          current: item.current,
          power: item.power,
          energy: item.energy,
          frequency: item.frequency,
          powerFactor: item.powerFactor,
          apparentPower: item.apparentPower,
          reactivePower: item.reactivePower,
          temperature: item.temperature,
          humidity: item.humidity,
        }));

        setChartData(formattedData);

        if (formattedData.length > 0) {
          const lastItem = formattedData[formattedData.length - 1];
          lastTimestampRef.current = lastItem.timestamp;
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching energy data:", err);
        setError("Failed to load energy data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  useEffect(() => {
    if (!lastTimestampRef.current || timeRange > 24) return;

    const interval = setInterval(async () => {
      try {
        const newSensorData = await getSensorDataSince(
          new Date(lastTimestampRef.current!)
        );

        if (newSensorData.length > 0) {
          const formattedNewData = newSensorData.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: item.timestamp.toISOString(),
            voltage: item.voltage,
            current: item.current,
            power: item.power,
            energy: item.energy,
            frequency: item.frequency,
            powerFactor: item.powerFactor,
            apparentPower: item.apparentPower,
            reactivePower: item.reactivePower,
            temperature: item.temperature,
            humidity: item.humidity,
          }));

          appendNewData(formattedNewData);
        }
      } catch (err) {
        console.error("Error fetching real-time data:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [timeRange, appendNewData]);

  return { chartData, loading, error };
}
