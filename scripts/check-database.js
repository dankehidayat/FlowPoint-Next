// scripts/check-database.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking database contents...\n");

    // Get the latest record
    const latestRecord = await prisma.sensorReading.findFirst({
      orderBy: { timestamp: "desc" },
    });

    if (!latestRecord) {
      console.log("❌ No records found in database");
      return;
    }

    console.log("📊 LATEST DATABASE RECORD:");
    console.log("══════════════════════════════════════════════════════");
    console.log(`ID: ${latestRecord.id}`);
    console.log(`Timestamp: ${latestRecord.timestamp}`);
    console.log("──────────────────────────────────────────────────────");
    console.log(
      `Active Power:    ${latestRecord.power?.toFixed(1).padStart(8)} W`
    );
    console.log(
      `Apparent Power:  ${latestRecord.apparentPower
        ?.toFixed(1)
        .padStart(8)} VA`
    );
    console.log(
      `Reactive Power:  ${latestRecord.reactivePower
        ?.toFixed(1)
        .padStart(8)} VAR`
    );
    console.log(
      `Power Factor:    ${latestRecord.powerFactor?.toFixed(3).padStart(8)}`
    );
    console.log(
      `Voltage:         ${latestRecord.voltage?.toFixed(1).padStart(8)} V`
    );
    console.log(
      `Current:         ${latestRecord.current?.toFixed(3).padStart(8)} A`
    );
    console.log(
      `Frequency:       ${latestRecord.frequency?.toFixed(1).padStart(8)} Hz`
    );
    console.log(
      `Energy:          ${latestRecord.energy?.toFixed(1).padStart(8)} Wh`
    );
    console.log(
      `Temperature:     ${latestRecord.temperature?.toFixed(1).padStart(8)} °C`
    );
    console.log(
      `Humidity:        ${latestRecord.humidity?.toFixed(1).padStart(8)} %`
    );
    console.log("══════════════════════════════════════════════════════\n");

    // Check if any power values are zero
    const zeroFields = [];
    if (latestRecord.power === 0) zeroFields.push("Active Power");
    if (latestRecord.apparentPower === 0) zeroFields.push("Apparent Power");
    if (latestRecord.reactivePower === 0) zeroFields.push("Reactive Power");
    if (latestRecord.powerFactor === 0) zeroFields.push("Power Factor");

    if (zeroFields.length > 0) {
      console.log(`⚠️  Zero values detected: ${zeroFields.join(", ")}`);
      console.log("   This might indicate Blynk pins are not sending data\n");
    }

    // Count total records
    const totalRecords = await prisma.sensorReading.count();
    console.log(`📈 Total records in database: ${totalRecords}`);
  } catch (error) {
    console.error("❌ Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
