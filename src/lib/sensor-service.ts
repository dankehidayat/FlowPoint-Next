// src/lib/sensor-service.ts
// Client-side API calls for sensor data

export interface SensorReading {
  id: number;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerFactor: number;
  apparentPower: number;
  reactivePower: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
}

interface SensorDataInput {
  voltage?: number | string;
  current?: number | string;
  activePower?: number | string;
  power?: number | string;
  totalEnergy?: number | string;
  energy?: number | string;
  frequency?: number | string;
  powerFactor?: number | string;
  apparentPower?: number | string;
  reactivePower?: number | string;
  temperature?: number | string;
  humidity?: number | string;
}

// API calls for client-side
export async function getAggregatedSensorData(
  hours: number = 24
): Promise<SensorReading[]> {
  try {
    const response = await fetch(`/api/sensor?hours=${hours}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to SensorReading format
    return data.map((item: any, index: number) => ({
      id: index,
      voltage: item.voltage || 0,
      current: item.current || 0,
      power: item.power || 0,
      energy: item.energy || 0,
      frequency: item.frequency || 0,
      powerFactor: item.powerFactor || 0,
      apparentPower: item.apparentPower || 0,
      reactivePower: item.reactivePower || 0,
      temperature: item.temperature || 0,
      humidity: item.humidity || 0,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error("Error fetching aggregated sensor data:", error);
    return [];
  }
}

export async function getSensorDataSince(
  since: Date
): Promise<SensorReading[]> {
  try {
    const response = await fetch(`/api/sensor?since=${since.toISOString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to SensorReading format
    return data.map((item: any, index: number) => ({
      id: index,
      voltage: item.voltage || 0,
      current: item.current || 0,
      power: item.power || 0,
      energy: item.energy || 0,
      frequency: item.frequency || 0,
      powerFactor: item.powerFactor || 0,
      apparentPower: item.apparentPower || 0,
      reactivePower: item.reactivePower || 0,
      temperature: item.temperature || 0,
      humidity: item.humidity || 0,
      timestamp: new Date(item.timestamp),
    }));
  } catch (error) {
    console.error("Error fetching sensor data since timestamp:", error);
    return [];
  }
}

export async function getLatestSensorReading(): Promise<SensorReading | null> {
  try {
    const response = await fetch("/api/sensor/latest", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data) return null;

    return {
      id: data.id,
      voltage: data.voltage || 0,
      current: data.current || 0,
      power: data.power || 0,
      energy: data.energy || 0,
      frequency: data.frequency || 0,
      powerFactor: data.powerFactor || 0,
      apparentPower: data.apparentPower || 0,
      reactivePower: data.reactivePower || 0,
      temperature: data.temperature || 0,
      humidity: data.humidity || 0,
      timestamp: new Date(data.timestamp),
    };
  } catch (error) {
    console.error("Error fetching latest sensor reading:", error);
    return null;
  }
}

// Optimized data saving - call API instead of direct DB
export async function saveSensorDataOptimized(
  data: SensorDataInput
): Promise<SensorReading | null> {
  try {
    const response = await fetch("/api/sensor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Optimized sensor data saved via API");
    return result;
  } catch (error) {
    console.error("❌ Error saving optimized sensor data:", error);
    return null;
  }
}

// Add the missing saveSensorData function to fix the import error
export async function saveSensorData(
  data: SensorDataInput
): Promise<SensorReading | null> {
  // Use the optimized version
  return saveSensorDataOptimized(data);
}
