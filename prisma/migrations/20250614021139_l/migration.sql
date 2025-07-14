/*
  Warnings:

  - You are about to drop the column `collaboratorId` on the `CollaboratorService` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[serviceId,userId,shopId]` on the table `CollaboratorService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `CollaboratorService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CollaboratorService" DROP CONSTRAINT "CollaboratorService_collaboratorId_fkey";

-- DropIndex
DROP INDEX "CollaboratorService_serviceId_collaboratorId_shopId_idx";

-- DropIndex
DROP INDEX "CollaboratorService_serviceId_collaboratorId_shopId_key";

-- AlterTable
ALTER TABLE "CollaboratorService" DROP COLUMN "collaboratorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "CollaboratorService_serviceId_userId_shopId_idx" ON "CollaboratorService"("serviceId", "userId", "shopId");

-- CreateIndex
CREATE UNIQUE INDEX "CollaboratorService_serviceId_userId_shopId_key" ON "CollaboratorService"("serviceId", "userId", "shopId");

-- AddForeignKey
ALTER TABLE "CollaboratorService" ADD CONSTRAINT "CollaboratorService_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
