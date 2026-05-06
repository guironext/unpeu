/*
  Warnings:

  - Added the required column `promotionId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rubriqueId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "promotionId" TEXT NOT NULL,
ADD COLUMN     "rubriqueId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contact" TEXT;

-- CreateTable
CREATE TABLE "Rubrique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rubrique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taux" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Promotion_taux_idx" ON "Promotion"("taux");

-- CreateIndex
CREATE INDEX "Product_rubriqueId_idx" ON "Product"("rubriqueId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_rubriqueId_fkey" FOREIGN KEY ("rubriqueId") REFERENCES "Rubrique"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
