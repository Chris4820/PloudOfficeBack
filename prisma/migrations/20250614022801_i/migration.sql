/*
  Warnings:

  - You are about to drop the column `shopId` on the `CollaboratorService` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CollaboratorService` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[collaboratorId,serviceId]` on the table `CollaboratorService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collaboratorId` to the `CollaboratorService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollaboratorService" DROP CONSTRAINT "CollaboratorService_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "CollaboratorService" DROP CONSTRAINT "CollaboratorService_shopId_fkey";

-- DropForeignKey
ALTER TABLE "CollaboratorService" DROP CONSTRAINT "CollaboratorService_userId_fkey";

-- DropIndex
DROP INDEX "CollaboratorService_serviceId_userId_shopId_idx";

-- DropIndex
DROP INDEX "CollaboratorService_serviceId_userId_shopId_key";

-- AlterTable
ALTER TABLE "CollaboratorService" DROP COLUMN "shopId",
DROP COLUMN "userId",
ADD COLUMN     "collaboratorId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "CollaboratorService_collaboratorId_serviceId_idx" ON "CollaboratorService"("collaboratorId", "serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "CollaboratorService_collaboratorId_serviceId_key" ON "CollaboratorService"("collaboratorId", "serviceId");

-- AddForeignKey
ALTER TABLE "CollaboratorService" ADD CONSTRAINT "CollaboratorService_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorService" ADD CONSTRAINT "CollaboratorService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
