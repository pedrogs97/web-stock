/*
  Warnings:

  - Changed the type of `status` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
ALTER COLUMN "picturePath" DROP NOT NULL;
