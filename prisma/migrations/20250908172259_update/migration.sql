/*
  Warnings:

  - You are about to drop the column `isActive` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the column `shopId` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Collaborator` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Collaborator` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Collaborator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Collaborator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Appointment" DROP CONSTRAINT "Appointment_collaboratorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Collaborator" DROP CONSTRAINT "Collaborator_shopId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Collaborator" DROP CONSTRAINT "Collaborator_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shop" DROP CONSTRAINT "Shop_ownerId_fkey";

-- DropIndex
DROP INDEX "public"."Collaborator_shopId_userId_key";

-- DropIndex
DROP INDEX "public"."Collaborator_status_idx";

-- DropIndex
DROP INDEX "public"."Collaborator_userId_idx";

-- AlterTable
ALTER TABLE "public"."Collaborator" DROP COLUMN "isActive",
DROP COLUMN "role",
DROP COLUMN "shopId",
DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "shortName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sidebarOpen" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "theme" "public"."ThemeEnum" NOT NULL DEFAULT 'LIGHT';

-- AlterTable
ALTER TABLE "public"."CollaboratorService" ADD COLUMN     "collaboratorShopId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Schedule" ADD COLUMN     "collaboratorShopId" INTEGER;

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."CollaboratorShop" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."CollaboratorRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."InviteStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "CollaboratorShop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CollaboratorShop_userId_idx" ON "public"."CollaboratorShop"("userId");

-- CreateIndex
CREATE INDEX "CollaboratorShop_status_idx" ON "public"."CollaboratorShop"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CollaboratorShop_shopId_userId_key" ON "public"."CollaboratorShop"("shopId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Collaborator_email_key" ON "public"."Collaborator"("email");

-- AddForeignKey
ALTER TABLE "public"."Shop" ADD CONSTRAINT "Shop_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."Collaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollaboratorShop" ADD CONSTRAINT "CollaboratorShop_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollaboratorShop" ADD CONSTRAINT "CollaboratorShop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Collaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CollaboratorService" ADD CONSTRAINT "CollaboratorService_collaboratorShopId_fkey" FOREIGN KEY ("collaboratorShopId") REFERENCES "public"."CollaboratorShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "public"."Collaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_collaboratorShopId_fkey" FOREIGN KEY ("collaboratorShopId") REFERENCES "public"."CollaboratorShop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
