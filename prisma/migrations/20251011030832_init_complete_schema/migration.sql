/*
  Warnings:

  - You are about to drop the column `energy` on the `sensor_readings` table. All the data in the column will be lost.
  - You are about to drop the column `power` on the `sensor_readings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sensor_readings" DROP COLUMN "energy",
DROP COLUMN "power",
ADD COLUMN     "activePower" DOUBLE PRECISION,
ADD COLUMN     "totalEnergy" DOUBLE PRECISION;
