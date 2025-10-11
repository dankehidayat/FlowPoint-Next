// scripts/auto-record.js
async function autoRecord() {
  try {
    console.log(
      `🕒 [${new Date().toLocaleTimeString()}] Fetching sensor data...`
    );

    const response = await fetch("http://localhost:3000/blynk");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log(`✅ [${new Date().toLocaleTimeString()}] ALL SENSOR DATA:`);
    console.log("╔═══════════════════════════════════════╗");
    console.log("║           POWER ANALYTICS             ║");
    console.log("╠═══════════════════════════════════════╣");
    console.log(
      `║ Active Power:    ${data.power?.toFixed(1).padStart(8)} W     ║`
    );
    console.log(
      `║ Apparent Power:  ${data.apparentPower?.toFixed(1).padStart(8)} VA    ║`
    );
    console.log(
      `║ Reactive Power:  ${data.reactivePower?.toFixed(1).padStart(8)} VAR   ║`
    );
    console.log(
      `║ Power Factor:    ${data.powerFactor?.toFixed(3).padStart(8)}        ║`
    );
    console.log("╠═══════════════════════════════════════╣");
    console.log(
      `║ Voltage:         ${data.voltage?.toFixed(1).padStart(8)} V     ║`
    );
    console.log(
      `║ Current:         ${data.current?.toFixed(3).padStart(8)} A     ║`
    );
    console.log(
      `║ Frequency:       ${data.frequency?.toFixed(1).padStart(8)} Hz   ║`
    );
    console.log(
      `║ Energy:          ${data.energy?.toFixed(1).padStart(8)} Wh    ║`
    );
    console.log("╠═══════════════════════════════════════╣");
    console.log(
      `║ Temperature:     ${data.temperature?.toFixed(1).padStart(8)} °C    ║`
    );
    console.log(
      `║ Humidity:        ${data.humidity?.toFixed(1).padStart(8)} %     ║`
    );
    console.log("╚═══════════════════════════════════════╝");
    console.log(`📊 Saved to database: ${data.savedToDatabase ? "✅" : "❌"}`);
    console.log(""); // Empty line for readability
  } catch (error) {
    console.error(
      `❌ [${new Date().toLocaleTimeString()}] Auto-record failed:`,
      error.message
    );
  }
}

// Record every 30 seconds
const INTERVAL_SECONDS = 30;

console.log(
  `🚀 Starting automatic sensor data recording every ${INTERVAL_SECONDS} seconds...`
);
console.log(
  "📡 Make sure your Next.js app is running on http://localhost:3000"
);
console.log("⏹️  Press Ctrl+C to stop recording\n");

// Run immediately
autoRecord();

// Then set up interval
setInterval(autoRecord, INTERVAL_SECONDS * 1000);
