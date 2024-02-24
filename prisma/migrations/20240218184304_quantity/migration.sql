/*
  Warnings:

  - You are about to drop the column `availableNew` on the `historicProducts` table. All the data in the column will be lost.
  - You are about to drop the column `availableOld` on the `historicProducts` table. All the data in the column will be lost.
  - You are about to drop the column `available` on the `products` table. All the data in the column will be lost.
  - Added the required column `quantityNew` to the `historicProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityOld` to the `historicProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "historicProducts" DROP COLUMN "availableNew",
DROP COLUMN "availableOld",
ADD COLUMN     "quantityNew" INTEGER NOT NULL,
ADD COLUMN     "quantityOld" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "available",
ADD COLUMN     "quantity" INTEGER NOT NULL;
