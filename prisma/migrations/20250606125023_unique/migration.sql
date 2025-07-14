/*
  Warnings:

  - A unique constraint covering the columns `[serviceId,collaboratorId,shopId]` on the table `CollaboratorService` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CollaboratorService_serviceId_collaboratorId_shopId_key" ON "CollaboratorService"("serviceId", "collaboratorId", "shopId");
