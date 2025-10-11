// lib/sensor-service.ts
import { SensorData as PrismaSensorData } from "@prisma/client";
import { prisma } from "./prisma"; // Import from singleton

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

export async function saveSensorData(data: any): Promise<SensorReading> {
  try {
    console.log("Saving sensor data to database:", data);

    const reading = await prisma.sensorData.create({
      data: {
        voltage: parseFloat(data.voltage) || 0,
        current: parseFloat(data.current) || 0,
        power: parseFloat(data.activePower || data.power) || 0,
        energy: parseFloat(data.totalEnergy || data.energy) || 0,
        frequency: parseFloat(data.frequency) || 0,
        powerFactor: parseFloat(data.powerFactor) || 0,
        apparentPower: parseFloat(data.apparentPower) || 0,
        reactivePower: parseFloat(data.reactivePower) || 0,
        temperature: parseFloat(data.temperature) || 0,
        humidity: parseFloat(data.humidity) || 0,
      },
    });

    console.log("✅ Sensor data saved with ID:", reading.id);
    return convertPrismaToSensorReading(reading);
  } catch (error) {
    console.error("❌ Error saving sensor data:", error);
    throw error;
  }
}

export async function getRecentSensorData(
  hours: number = 24,
  limit: number = 100
): Promise<SensorReading[]> {
  try {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const readings = await prisma.sensorData.findMany({
      where: {
        timestamp: {
          gte: cutoffTime,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
    });

    console.log(`✅ Fetched ${readings.length} recent sensor readings`);
    return readings.map(convertPrismaToSensorReading);
  } catch (error) {
    console.error("❌ Error fetching sensor data:", error);
    throw error;
  }
}

// Helper function to convert Prisma model to SensorReading
function convertPrismaToSensorReading(
  reading: PrismaSensorData
): SensorReading {
  return {
    id: reading.id,
    voltage: reading.voltage,
    current: reading.current,
    power: reading.power,
    energy: reading.energy,
    frequency: reading.frequency,
    powerFactor: reading.powerFactor,
    apparentPower: reading.apparentPower,
    reactivePower: reading.reactivePower,
    temperature: reading.temperature,
    humidity: reading.humidity,
    timestamp: reading.timestamp,
  };
}
