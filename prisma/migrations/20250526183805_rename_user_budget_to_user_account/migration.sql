/*
  Warnings:

  - You are about to drop the column `budgetId` on the `User` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_budgetId_fkey";

-- DropIndex
DROP INDEX "User_budgetId_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "budgetId",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "User_accountId_idx" ON "User"("accountId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
