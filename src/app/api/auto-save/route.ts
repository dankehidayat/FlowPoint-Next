// src/app/api/sensor/auto-save/route.ts
import { NextResponse } from "next/server";
import { saveSensorData } from "@/lib/sensor-service";

const BLYNK_AUTH_TOKEN = process.env.BLYNK_AUTH_TOKEN;
const BLYNK_BASE_URL = "http://iot.serangkota.go.id:8080";

async function fetchBlynkData() {
  const pinUrls = [
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V0`, // Voltage
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V1`, // Current
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V2`, // Power
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V3`, // Power Factor
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V4`, // Apparent Power
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V5`, // Energy
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V6`, // Frequency
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V7`, // Reactive Power
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V8`, // Temperature
    `${BLYNK_BASE_URL}/${BLYNK_AUTH_TOKEN}/get/V9`, // Humidity
  ];

  const responses = await Promise.all(
    pinUrls.map(async (url) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
          method: "GET",
          headers: { "User-Agent": "Flowpoint-Dashboard/1.0" },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) return "0";
        const text = await response.text();

        if (
          !text ||
          text.trim() === "" ||
          text === "null" ||
          text === "undefined"
        ) {
          return "0";
        }

        return text;
      } catch (error) {
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
      return 0;
    }
  };

  return {
    voltage: parseBlynkValue(responses[0]),
    current: parseBlynkValue(responses[1]),
    power: parseBlynkValue(responses[2]),
    powerFactor: parseBlynkValue(responses[3]),
    apparentPower: parseBlynkValue(responses[4]),
    energy: parseBlynkValue(responses[5]),
    frequency: parseBlynkValue(responses[6]),
    reactivePower: parseBlynkValue(responses[7]),
    temperature: parseBlynkValue(responses[8]),
    humidity: parseBlynkValue(responses[9]),
  };
}

export async function GET() {
  try {
    const sensorData = await fetchBlynkData();
    const savedReading = await saveSensorData(sensorData);

    return NextResponse.json({
      success: true,
      id: savedReading.id,
      timestamp: savedReading.timestamp,
      data: sensorData,
    });
  } catch (error) {
    console.error("Auto-save error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
