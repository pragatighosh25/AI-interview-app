/*
  Warnings:

  - Added the required column `data` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Interview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
