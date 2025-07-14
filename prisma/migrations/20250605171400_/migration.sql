/*
  Warnings:

  - You are about to drop the column `active` on the `Service` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Service_active_featured_idx";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "Service_isActive_featured_idx" ON "Service"("isActive", "featured");
