/*
  Warnings:

  - You are about to drop the column `eventType` on the `Action` table. All the data in the column will be lost.
  - Added the required column `actionType` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isInput` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('EVEN_MINUTE');

-- AlterTable
ALTER TABLE "Action" DROP COLUMN "eventType",
ADD COLUMN     "actionType" "ActionType" NOT NULL,
ADD COLUMN     "isInput" BOOLEAN NOT NULL;
