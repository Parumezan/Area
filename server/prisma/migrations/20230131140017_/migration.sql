/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Brick` table. All the data in the column will be lost.
  - Added the required column `description` to the `Brick` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Brick" DROP CONSTRAINT "Brick_serviceId_fkey";

-- AlterTable
ALTER TABLE "Brick" DROP COLUMN "serviceId",
ADD COLUMN     "description" TEXT NOT NULL;
