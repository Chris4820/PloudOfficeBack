-- DropForeignKey
ALTER TABLE "CollaboratorService" DROP CONSTRAINT "CollaboratorService_shopId_fkey";

-- AddForeignKey
ALTER TABLE "CollaboratorService" ADD CONSTRAINT "CollaboratorService_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
