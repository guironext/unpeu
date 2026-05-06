/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Garantie` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Garantie` table. All the data in the column will be lost.
  - Made the column `description` on table `Garantie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Garantie" DROP COLUMN "imageUrl",
DROP COLUMN "name",
ADD COLUMN     "duree_garantie" INTEGER,
ALTER COLUMN "description" SET NOT NULL;
