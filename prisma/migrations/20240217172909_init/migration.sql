/*
  Warnings:

  - You are about to drop the column `createdAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- CreateTable
CREATE TABLE "historicProducts" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "availableOld" INTEGER NOT NULL,
    "availableNew" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historicProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "historicProducts" ADD CONSTRAINT "historicProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historicProducts" ADD CONSTRAINT "historicProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
