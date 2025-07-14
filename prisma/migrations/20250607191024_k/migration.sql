/*
  Warnings:

  - You are about to drop the column `active` on the `Shop` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Shop_active_city_idx";

-- DropIndex
DROP INDEX "Shop_postalCode_idx";

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "active",
ADD COLUMN     "isMaintenance" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Shop_isMaintenance_city_idx" ON "Shop"("isMaintenance", "city");
