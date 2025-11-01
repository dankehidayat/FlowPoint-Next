// src/lib/sensor-service-server.ts
// Server-side database operations for sensor data

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

// Server-side functions for database operations
export async function getAggregatedSensorDataServer(
  hours: number = 24
): Promise<any[]> {
  try {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const sensorData = await prisma.sensorData.findMany({
      where: {
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return sensorData;
  } catch (error) {
    console.error("Error fetching aggregated sensor data from DB:", error);
    return [];
  }
}

export async function getSensorDataSinceServer(since: Date): Promise<any[]> {
  try {
    const sensorData = await prisma.sensorData.findMany({
      where: {
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return sensorData;
  } catch (error) {
    console.error("Error fetching sensor data since timestamp from DB:", error);
    return [];
  }
}

export async function getLatestSensorReadingServer(): Promise<any> {
  try {
    const latestReading = await prisma.sensorData.findFirst({
      orderBy: {
        timestamp: "desc",
      },
    });

    return latestReading;
  } catch (error) {
    console.error("Error fetching latest sensor reading from DB:", error);
    return null;
  }
}

export async function saveSensorDataOptimized(
  data: SensorDataInput
): Promise<any> {
  try {
    // Convert string values to numbers where necessary
    const processedData = {
      voltage: data.voltage ? Number(data.voltage) : 0,
      current: data.current ? Number(data.current) : 0,
      power:
        data.power || data.activePower
          ? Number(data.power || data.activePower)
          : 0,
      energy:
        data.energy || data.totalEnergy
          ? Number(data.energy || data.totalEnergy)
          : 0,
      frequency: data.frequency ? Number(data.frequency) : 0,
      powerFactor: data.powerFactor ? Number(data.powerFactor) : 0,
      apparentPower: data.apparentPower ? Number(data.apparentPower) : 0,
      reactivePower: data.reactivePower ? Number(data.reactivePower) : 0,
      temperature: data.temperature ? Number(data.temperature) : 0,
      humidity: data.humidity ? Number(data.humidity) : 0,
    };

    const savedReading = await prisma.sensorData.create({
      data: {
        ...processedData,
        timestamp: new Date(),
      },
    });

    console.log("✅ Sensor data saved to database");
    return savedReading;
  } catch (error) {
    console.error("❌ Error saving sensor data to database:", error);
    throw error;
  }
}
