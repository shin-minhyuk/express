/*
  Warnings:

  - A unique constraint covering the columns `[loginType,socialId]` on the table `LoginProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `socialId` to the `LoginProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginProvider" ADD COLUMN     "socialId" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LoginProvider_loginType_socialId_key" ON "LoginProvider"("loginType", "socialId");
