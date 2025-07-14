/*
  Warnings:

  - You are about to drop the column `startTime` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `end` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_shopId_clientId_collaboratorId_serviceId_startT_idx";

-- DropIndex
DROP INDEX "Appointment_status_startTime_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "startTime",
ADD COLUMN     "end" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Appointment_shopId_clientId_collaboratorId_serviceId_start_idx" ON "Appointment"("shopId", "clientId", "collaboratorId", "serviceId", "start");

-- CreateIndex
CREATE INDEX "Appointment_status_start_end_idx" ON "Appointment"("status", "start", "end");
