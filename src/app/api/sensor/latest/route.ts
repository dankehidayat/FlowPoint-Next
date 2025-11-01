// src/app/api/sensor/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getAggregatedSensorDataServer,
  getSensorDataSinceServer,
  saveSensorDataOptimized,
} from "@/lib/sensor-service-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = searchParams.get("hours")
      ? parseInt(searchParams.get("hours")!)
      : 24;
    const since = searchParams.get("since");

    let sensorData;

    if (since) {
      // Get data since specific timestamp
      sensorData = await getSensorDataSinceServer(new Date(since));
    } else {
      // Get aggregated data based on time range
      sensorData = await getAggregatedSensorDataServer(hours);
    }

    return NextResponse.json(sensorData);
  } catch (error) {
    console.error("Error in sensor API:", error);
    return NextResponse.json(
      { error: "Failed to fetch sensor data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const savedReading = await saveSensorDataOptimized(data);

    return NextResponse.json(savedReading);
  } catch (error) {
    console.error("Error saving sensor data:", error);
    return NextResponse.json(
      { error: "Failed to save sensor data" },
      { status: 500 }
    );
  }
}
