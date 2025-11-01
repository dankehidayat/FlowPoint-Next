// src/app/api/sensor/latest/route.ts
import { NextResponse } from "next/server";
import { getLatestSensorReadingServer } from "@/lib/sensor-service-server";

export async function GET() {
  try {
    const latestReading = await getLatestSensorReadingServer();

    if (!latestReading) {
      return NextResponse.json(
        { error: "No sensor data found" },
        { status: 404 }
      );
    }

    return NextResponse.json(latestReading);
  } catch (error) {
    console.error("Error fetching latest sensor reading:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest sensor reading" },
      { status: 500 }
    );
  }
}
