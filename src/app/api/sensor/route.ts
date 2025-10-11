import { NextResponse } from "next/server";
import { getRecentSensorData } from "@/lib/sensor-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hours = parseInt(searchParams.get("hours") || "24");
    const limit = parseInt(searchParams.get("limit") || "100");

    console.log(
      `📊 Fetching sensor data for last ${hours} hours, limit ${limit}`
    );

    const sensorData = await getRecentSensorData(hours, limit);

    console.log(`✅ Returning ${sensorData.length} sensor readings`);

    return NextResponse.json(sensorData);
  } catch (error) {
    console.error("❌ Error in sensor API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch sensor data: " + (error as Error).message },
      { status: 500 }
    );
  }
}
