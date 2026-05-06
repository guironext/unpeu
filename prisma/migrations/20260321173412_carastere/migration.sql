/*
  Warnings:

  - You are about to drop the `CaratéristiqueTechnique` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CaratéristiqueTechniqueToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CaratéristiqueTechniqueToProduct" DROP CONSTRAINT "_CaratéristiqueTechniqueToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CaratéristiqueTechniqueToProduct" DROP CONSTRAINT "_CaratéristiqueTechniqueToProduct_B_fkey";

-- DropTable
DROP TABLE "CaratéristiqueTechnique";

-- DropTable
DROP TABLE "_CaratéristiqueTechniqueToProduct";

-- CreateTable
CREATE TABLE "CaracteristiqueTechnique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaracteristiqueTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaracteristiqueTechniqueToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaracteristiqueTechniqueToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "CaracteristiqueTechnique_name_idx" ON "CaracteristiqueTechnique"("name");

-- CreateIndex
CREATE INDEX "CaracteristiqueTechnique_title_idx" ON "CaracteristiqueTechnique"("title");

-- CreateIndex
CREATE INDEX "CaracteristiqueTechnique_description_idx" ON "CaracteristiqueTechnique"("description");

-- CreateIndex
CREATE INDEX "CaracteristiqueTechnique_imageUrl_idx" ON "CaracteristiqueTechnique"("imageUrl");

-- CreateIndex
CREATE INDEX "_CaracteristiqueTechniqueToProduct_B_index" ON "_CaracteristiqueTechniqueToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CaracteristiqueTechniqueToProduct" ADD CONSTRAINT "_CaracteristiqueTechniqueToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "CaracteristiqueTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaracteristiqueTechniqueToProduct" ADD CONSTRAINT "_CaracteristiqueTechniqueToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
