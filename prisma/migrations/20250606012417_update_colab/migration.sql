/*
  Warnings:

  - You are about to drop the column `barberId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `clientsId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `discountEnd` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `discountStart` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `discountedPrice` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_clientsId_fkey";

-- DropIndex
DROP INDEX "Service_barberId_idx";

-- DropIndex
DROP INDEX "Service_isActive_featured_idx";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "barberId",
DROP COLUMN "clientsId",
DROP COLUMN "discountEnd",
DROP COLUMN "discountStart",
DROP COLUMN "discountedPrice",
DROP COLUMN "duration",
DROP COLUMN "featured",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "CollaboratorService" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "collaboratorId" INTEGER NOT NULL,
    "shopId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "CollaboratorService_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollaboratorService" ADD CONSTRAINT "CollaboratorService_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorService" ADD CONSTRAINT "CollaboratorService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollaboratorService" ADD CONSTRAINT "CollaboratorService_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
