-- CreateTable
CREATE TABLE "ShopSchedule" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "breakStart" TEXT,
    "breakEnd" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShopSchedule_shopId_dayOfWeek_idx" ON "ShopSchedule"("shopId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "ShopSchedule_shopId_dayOfWeek_key" ON "ShopSchedule"("shopId", "dayOfWeek");

-- AddForeignKey
ALTER TABLE "ShopSchedule" ADD CONSTRAINT "ShopSchedule_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
