/*
  Warnings:

  - You are about to drop the column `userId` on the `historicProducts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "historicProducts" DROP CONSTRAINT "historicProducts_userId_fkey";

-- AlterTable
ALTER TABLE "historicProducts" DROP COLUMN "userId";
