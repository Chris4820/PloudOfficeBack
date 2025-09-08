/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Appointment_uuid_key" ON "Appointment"("uuid");
