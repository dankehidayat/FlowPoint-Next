// lib/sensor-service.ts
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

// Define proper type for sensor data
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

// Type for Prisma create data
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

export async function saveSensorData(
  data: SensorDataInput
): Promise<SensorReading> {
  try {
    console.log("Saving sensor data to database:", data);

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

    console.log("✅ Sensor data saved successfully:", reading.id);
    return reading;
  } catch (error) {
    console.error("❌ Error saving sensor data:", error);
    throw new Error(`Failed to save sensor data: ${(error as Error).message}`);
  }
}
