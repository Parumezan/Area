/*
  Warnings:

  - You are about to drop the column `evenType` on the `Action` table. All the data in the column will be lost.
  - Added the required column `eventType` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "evenType",
ADD COLUMN     "eventType" TEXT NOT NULL;
