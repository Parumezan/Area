/*
  Warnings:

  - You are about to drop the column `active` on the `Brick` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brick" DROP COLUMN "active",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false;
