/*
  Warnings:

  - You are about to drop the column `clerkid` on the `agents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "agents" DROP COLUMN "clerkid";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "clerkid" TEXT;
