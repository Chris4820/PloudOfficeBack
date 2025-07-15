-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "uuid" TEXT;

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
