// lib/api.ts
const API_BASE = "/api";

export const api = {
  async getBlynkData() {
    try {
      console.log(`🔍 API: Fetching from ${API_BASE}/blynk`);
      const response = await fetch(`${API_BASE}/blynk`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`🔍 API: Response status ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 API: Data received", data);
      return data;
    } catch (error) {
      console.error("🔍 API: Fetch failed", error);

      // Type-safe error handling
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      // Return fallback data instead of throwing
      return {
        voltage: 0,
        current: 0,
        power: 0,
        energy: 0,
        frequency: 0,
        powerFactor: 0,
        apparentPower: 0,
        reactivePower: 0,
        temperature: 0,
        humidity: 0,
        error: errorMessage,
      };
    }
  },

  async autoSave() {
    try {
      const response = await fetch(`${API_BASE}/sensor/auto-save`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Auto-save API error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  async getSensorData(hours: number = 24, limit: number = 100) {
    try {
      const response = await fetch(`/api/sensor?hours=${hours}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Sensor data API error:", error);
      return [];
    }
  },
};
