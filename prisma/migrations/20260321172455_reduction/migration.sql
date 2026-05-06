/*
  Warnings:

  - You are about to drop the column `matériau` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "matériau",
ADD COLUMN     "material" TEXT,
ADD COLUMN     "reduction_percentage" INTEGER;
