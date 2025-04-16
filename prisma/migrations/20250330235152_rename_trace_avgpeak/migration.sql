/*
  Warnings:

  - You are about to drop the column `avg_intensity` on the `Trace` table. All the data in the column will be lost.
  - Added the required column `avg_peak_intensity` to the `Trace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trace" DROP COLUMN "avg_intensity",
ADD COLUMN     "avg_peak_intensity" DOUBLE PRECISION NOT NULL;
