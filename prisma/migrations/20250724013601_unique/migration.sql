/*
  Warnings:

  - A unique constraint covering the columns `[shopId,email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Client_email_key";

-- DropIndex
DROP INDEX "Client_shopId_email_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Client_shopId_email_key" ON "Client"("shopId", "email");
