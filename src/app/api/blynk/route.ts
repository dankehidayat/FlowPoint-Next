import { NextResponse } from "next/server";
import { saveSensorData } from "@/lib/sensor-service";

export async function GET() {
  const authToken = process.env.BLYNK_AUTH_TOKEN;
  const baseUrl = "http://iot.serangkota.go.id:8080";

  // Validate that token exists
  if (!authToken) {
    console.error("❌ BLYNK_AUTH_TOKEN is not set");
    return NextResponse.json(
      { error: "Server configuration error: Blynk token missing" },
      { status: 500 }
    );
  }

  try {
    console.log("Starting Blynk API fetch...");

    const pinUrls = [
      `${baseUrl}/${authToken}/get/V0`, // Voltage
      `${baseUrl}/${authToken}/get/V1`, // Current
      `${baseUrl}/${authToken}/get/V2`, // Power (activePower)
      `${baseUrl}/${authToken}/get/V3`, // Power Factor
      `${baseUrl}/${authToken}/get/V4`, // Apparent Power
      `${baseUrl}/${authToken}/get/V5`, // Energy (totalEnergy)
      `${baseUrl}/${authToken}/get/V6`, // Frequency
      `${baseUrl}/${authToken}/get/V7`, // Reactive Power
      `${baseUrl}/${authToken}/get/V8`, // Temperature
      `${baseUrl}/${authToken}/get/V9`, // Humidity
    ];

    const responses = await Promise.all(
      pinUrls.map(async (url, index) => {
        try {
          console.log(`Fetching from ${url}...`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(url, {
            method: "GET",
            headers: {
              "User-Agent": "Flowpoint-Dashboard/1.0",
            },
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            console.error(`HTTP error for ${url}: ${response.status}`);
            return "0";
          }

          const text = await response.text();
          console.log(`Response from ${url}: "${text}"`);

          if (
            !text ||
            text.trim() === "" ||
            text === "null" ||
            text === "undefined"
          ) {
            console.warn(`Empty or invalid response from ${url}`);
            return "0";
          }

          return text;
        } catch (error) {
          console.error(`Network error fetching ${url}:`, error);
          return "0";
        }
      })
    );

    const parseBlynkValue = (responseText: string): number => {
      try {
        if (responseText.startsWith("[") && responseText.endsWith("]")) {
          const parsedArray = JSON.parse(responseText);
          return parseFloat(parsedArray[0]) || 0;
        }
        return parseFloat(responseText) || 0;
      } catch (error) {
        console.error("Error parsing value:", responseText, error);
        return 0;
      }
    };

    // Create sensor data with field names that match your frontend
    const sensorData = {
      voltage: parseBlynkValue(responses[0]),
      current: parseBlynkValue(responses[1]),
      activePower: parseBlynkValue(responses[2]), // This will be mapped to 'power' in database
      powerFactor: parseBlynkValue(responses[3]),
      apparentPower: parseBlynkValue(responses[4]),
      totalEnergy: parseBlynkValue(responses[5]), // This will be mapped to 'energy' in database
      frequency: parseBlynkValue(responses[6]),
      reactivePower: parseBlynkValue(responses[7]),
      temperature: parseBlynkValue(responses[8]),
      humidity: parseBlynkValue(responses[9]),
    };

    console.log("Final parsed data:", sensorData);

    // Save to database
    let savedToDatabase = false;
    try {
      const savedReading = await saveSensorData(sensorData);
      savedToDatabase = true;
      console.log("✅ Sensor data saved to database with ID:", savedReading.id);
    } catch (saveError) {
      console.error("❌ Failed to save sensor data to database:", saveError);
    }

    // Return data in format expected by frontend
    const responseData = {
      // Return both field names for compatibility
      voltage: sensorData.voltage,
      current: sensorData.current,
      power: sensorData.activePower, // Map activePower to power for frontend
      energy: sensorData.totalEnergy, // Map totalEnergy to energy for frontend
      frequency: sensorData.frequency,
      powerFactor: sensorData.powerFactor,
      apparentPower: sensorData.apparentPower,
      reactivePower: sensorData.reactivePower,
      temperature: sensorData.temperature,
      humidity: sensorData.humidity,
      savedToDatabase,
      timestamp: new Date().toISOString(),
    };

    const allZero = Object.values(sensorData).every((val) => val === 0);
    if (allZero) {
      console.warn("All values are zero - Blynk server might be down");
    } else {
      console.log("Successfully parsed non-zero values from Blynk server!");
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Blynk API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Blynk data: " + (error as Error).message },
      { status: 500 }
    );
  }
}
