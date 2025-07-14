/*
  Warnings:

  - The values [MODERN,CLASSIC,RUSTIC,LUXURY] on the enum `ThemeEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `barberId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `noShow` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reminderSent` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the column `isOwner` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the column `permissions` on the `Collaborator` table. All the data in the column will be lost.
  - The `breakStart` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `breakEnd` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `activeDomain` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `emailSupport` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `font` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `smsReminders` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `timeZone` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `locale` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collaboratorId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dayOfWeek` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startTime` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTime` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `lastLogin` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterEnum
BEGIN;
CREATE TYPE "ThemeEnum_new" AS ENUM ('LIGHT', 'DARK');
ALTER TABLE "User" ALTER COLUMN "theme" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "theme" TYPE "ThemeEnum_new" USING ("theme"::text::"ThemeEnum_new");
ALTER TYPE "ThemeEnum" RENAME TO "ThemeEnum_old";
ALTER TYPE "ThemeEnum_new" RENAME TO "ThemeEnum";
DROP TYPE "ThemeEnum_old";
ALTER TABLE "User" ALTER COLUMN "theme" SET DEFAULT 'LIGHT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "Clients" DROP CONSTRAINT "Clients_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_barberId_fkey";

-- DropForeignKey
ALTER TABLE "UserToken" DROP CONSTRAINT "UserToken_userId_fkey";

-- DropIndex
DROP INDEX "Appointment_shopId_clientId_barberId_serviceId_startTime_idx";

-- DropIndex
DROP INDEX "Collaborator_shopId_role_idx";

-- DropIndex
DROP INDEX "Collaborator_userId_active_idx";

-- DropIndex
DROP INDEX "Shop_activeDomain_key";

-- DropIndex
DROP INDEX "Shop_isMaintenance_city_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "barberId",
DROP COLUMN "endTime",
DROP COLUMN "noShow",
DROP COLUMN "reminderSent",
DROP COLUMN "scheduleId",
ADD COLUMN     "collaboratorId" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Collaborator" DROP COLUMN "active",
DROP COLUMN "isOwner",
DROP COLUMN "permissions",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "breakStart",
ADD COLUMN     "breakStart" TIMESTAMP(3),
DROP COLUMN "breakEnd",
ADD COLUMN     "breakEnd" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "activeDomain",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "currency",
DROP COLUMN "domain",
DROP COLUMN "emailSupport",
DROP COLUMN "facebook",
DROP COLUMN "font",
DROP COLUMN "instagram",
DROP COLUMN "phone",
DROP COLUMN "postalCode",
DROP COLUMN "smsReminders",
DROP COLUMN "timeZone",
DROP COLUMN "whatsapp",
ADD COLUMN     "emailCompany" TEXT,
ADD COLUMN     "facebookCompany" TEXT,
ADD COLUMN     "instagramCompany" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
DROP COLUMN "language",
DROP COLUMN "locale",
DROP COLUMN "timezone",
DROP COLUMN "verified",
ALTER COLUMN "lastLogin" SET NOT NULL;

-- DropTable
DROP TABLE "Clients";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "UserToken";

-- DropEnum
DROP TYPE "ClientStatus";

-- DropEnum
DROP TYPE "NotificationStatus";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "TokenType";

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_shopId_email_idx" ON "Client"("shopId", "email");

-- CreateIndex
CREATE INDEX "Client_shopId_phone_idx" ON "Client"("shopId", "phone");

-- CreateIndex
CREATE INDEX "Appointment_shopId_clientId_collaboratorId_serviceId_startT_idx" ON "Appointment"("shopId", "clientId", "collaboratorId", "serviceId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_userId_key" ON "Collaborator"("userId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "Collaborator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
