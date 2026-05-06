-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "caratéristique_technique" TEXT,
ADD COLUMN     "couleur" TEXT,
ADD COLUMN     "dimensions_et_poids" TEXT,
ADD COLUMN     "matériau" TEXT,
ADD COLUMN     "motif" TEXT,
ADD COLUMN     "saison" TEXT,
ADD COLUMN     "style" TEXT,
ADD COLUMN     "thème" TEXT,
ADD COLUMN     "weight" TEXT;

-- CreateTable
CREATE TABLE "CaratéristiqueTechnique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaratéristiqueTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Garantie" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Garantie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FicheTechnique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FicheTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescriptionTechnique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DescriptionTechnique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaratéristiqueTechniqueToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaratéristiqueTechniqueToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GarantieToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GarantieToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_FicheTechniqueToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FicheTechniqueToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DescriptionTechniqueToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DescriptionTechniqueToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "CaratéristiqueTechnique_name_idx" ON "CaratéristiqueTechnique"("name");

-- CreateIndex
CREATE INDEX "CaratéristiqueTechnique_title_idx" ON "CaratéristiqueTechnique"("title");

-- CreateIndex
CREATE INDEX "CaratéristiqueTechnique_description_idx" ON "CaratéristiqueTechnique"("description");

-- CreateIndex
CREATE INDEX "CaratéristiqueTechnique_imageUrl_idx" ON "CaratéristiqueTechnique"("imageUrl");

-- CreateIndex
CREATE INDEX "_CaratéristiqueTechniqueToProduct_B_index" ON "_CaratéristiqueTechniqueToProduct"("B");

-- CreateIndex
CREATE INDEX "_GarantieToProduct_B_index" ON "_GarantieToProduct"("B");

-- CreateIndex
CREATE INDEX "_FicheTechniqueToProduct_B_index" ON "_FicheTechniqueToProduct"("B");

-- CreateIndex
CREATE INDEX "_DescriptionTechniqueToProduct_B_index" ON "_DescriptionTechniqueToProduct"("B");

-- AddForeignKey
ALTER TABLE "_CaratéristiqueTechniqueToProduct" ADD CONSTRAINT "_CaratéristiqueTechniqueToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "CaratéristiqueTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaratéristiqueTechniqueToProduct" ADD CONSTRAINT "_CaratéristiqueTechniqueToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GarantieToProduct" ADD CONSTRAINT "_GarantieToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Garantie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GarantieToProduct" ADD CONSTRAINT "_GarantieToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FicheTechniqueToProduct" ADD CONSTRAINT "_FicheTechniqueToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "FicheTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FicheTechniqueToProduct" ADD CONSTRAINT "_FicheTechniqueToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DescriptionTechniqueToProduct" ADD CONSTRAINT "_DescriptionTechniqueToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "DescriptionTechnique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DescriptionTechniqueToProduct" ADD CONSTRAINT "_DescriptionTechniqueToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
