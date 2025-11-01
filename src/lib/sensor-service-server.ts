// src/lib/sensor-service-server.ts (SERVER-SIDE ONLY)
import { SensorData as PrismaSensorData } from "@prisma/client";
import { prisma } from "./prisma";

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

interface PrismaCreateData {
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
}

interface AggregatedSensorReading {
  timestamp: Date;
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
}

// Smart storage intervals
const STORAGE_STRATEGY = {
  realtime: { interval: 30 * 1000 }, // 30 seconds
  recent: { interval: 5 * 60 * 1000 }, // 5 minutes
  historical: { interval: 30 * 60 * 1000 }, // 30 minutes
};

const storageCache = new Map<string, number>();

function getStorageInterval(): number {
  return STORAGE_STRATEGY.recent.interval;
}

// Server-side optimized data saving
export async function saveSensorDataOptimized(
  data: SensorDataInput
): Promise<SensorReading | null> {
  try {
    const now = Date.now();
    const cacheKey = "last_sensor_save";
    const lastSave = storageCache.get(cacheKey) || 0;
    const storageInterval = getStorageInterval();

    if (now - lastSave < storageInterval) {
      return null;
    }

    console.log("💾 Saving optimized sensor data");

    const createData: PrismaCreateData = {
      voltage: parseFloat(String(data.voltage)) || 0,
      current: parseFloat(String(data.current)) || 0,
      power: parseFloat(String(data.activePower || data.power)) || 0,
      energy: parseFloat(String(data.totalEnergy || data.energy)) || 0,
      frequency: parseFloat(String(data.frequency)) || 0,
      powerFactor: parseFloat(String(data.powerFactor)) || 0,
      apparentPower: parseFloat(String(data.apparentPower)) || 0,
      reactivePower: parseFloat(String(data.reactivePower)) || 0,
      temperature: parseFloat(String(data.temperature)) || 0,
      humidity: parseFloat(String(data.humidity)) || 0,
    };

    const reading = await prisma.sensorData.create({
      data: createData,
    });

    storageCache.set(cacheKey, now);
    console.log("✅ Optimized sensor data saved");
    return reading;
  } catch (error) {
    console.error("❌ Error saving optimized sensor data:", error);
    return null;
  }
}

// Server-side direct database functions
export async function getAggregatedSensorDataServer(
  hours: number = 24
): Promise<SensorReading[]> {
  try {
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    const aggregationLevel = getAggregationLevel(hours);

    if (aggregationLevel === "raw") {
      return await getRawSensorData(startTime);
    }

    // Type the raw query result properly
    const result = await prisma.$queryRaw<AggregatedSensorReading[]>`
      SELECT 
        ${getAggregationSelect(aggregationLevel)},
        AVG(voltage) as voltage,
        AVG(current) as current,
        AVG(power) as power,
        AVG(energy) as energy,
        AVG(frequency) as frequency,
        AVG(power_factor) as "powerFactor",
        AVG(apparent_power) as "apparentPower",
        AVG(reactive_power) as "reactivePower",
        AVG(temperature) as temperature,
        AVG(humidity) as humidity
      FROM sensor_data
      WHERE timestamp >= ${startTime}
      GROUP BY ${getAggregationGroup(aggregationLevel)}
      ORDER BY timestamp ASC
    `;

    return convertAggregatedToSensorReading(result);
  } catch (error) {
    console.error("Error in getAggregatedSensorDataServer:", error);
    return await getRawSensorData(
      new Date(Date.now() - hours * 60 * 60 * 1000)
    );
  }
}

export async function getSensorDataSinceServer(
  since: Date
): Promise<SensorReading[]> {
  try {
    const sensorData = await prisma.sensorData.findMany({
      where: { timestamp: { gt: since } },
      orderBy: { timestamp: "asc" },
    });

    return sensorData;
  } catch (error) {
    console.error("Error fetching sensor data since timestamp:", error);
    return [];
  }
}

export async function getLatestSensorReadingServer(): Promise<SensorReading | null> {
  try {
    const readings = await prisma.sensorData.findMany({
      orderBy: { timestamp: "desc" },
      take: 1,
    });
    return readings[0] || null;
  } catch (error) {
    console.error("Error fetching latest sensor reading:", error);
    return null;
  }
}

// Helper functions
function getAggregationLevel(hours: number): string {
  if (hours <= 1) return "raw";
  if (hours <= 6) return "minute";
  if (hours <= 24) return "5minute";
  if (hours <= 168) return "hour";
  return "day";
}

function getAggregationSelect(level: string): string {
  switch (level) {
    case "minute":
      return `date_trunc('minute', timestamp) as timestamp`;
    case "5minute":
      return `date_trunc('minute', timestamp) - INTERVAL '1 minute' * (EXTRACT(minute FROM timestamp)::int % 5) as timestamp`;
    case "hour":
      return `date_trunc('hour', timestamp) as timestamp`;
    case "day":
      return `date_trunc('day', timestamp) as timestamp`;
    default:
      return `timestamp`;
  }
}

function getAggregationGroup(level: string): string {
  switch (level) {
    case "minute":
      return `date_trunc('minute', timestamp)`;
    case "5minute":
      return `date_trunc('minute', timestamp) - INTERVAL '1 minute' * (EXTRACT(minute FROM timestamp)::int % 5)`;
    case "hour":
      return `date_trunc('hour', timestamp)`;
    case "day":
      return `date_trunc('day', timestamp)`;
    default:
      return `timestamp`;
  }
}

async function getRawSensorData(startTime: Date): Promise<SensorReading[]> {
  const sensorData = await prisma.sensorData.findMany({
    where: { timestamp: { gte: startTime } },
    orderBy: { timestamp: "asc" },
  });

  return sensorData;
}

function convertAggregatedToSensorReading(
  aggregated: AggregatedSensorReading[]
): SensorReading[] {
  return aggregated.map((item, index) => ({
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
    timestamp: item.timestamp,
  }));
}
