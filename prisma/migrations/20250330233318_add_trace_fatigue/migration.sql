/*
  Warnings:

  - You are about to drop the column `peak_intensity` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `rep_peaks` on the `Trace` table. All the data in the column will be lost.
  - Made the column `avg_intensity` on table `Trace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trace" DROP COLUMN "peak_intensity",
DROP COLUMN "rep_peaks",
ADD COLUMN     "fatigue" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "avg_intensity" SET NOT NULL;
