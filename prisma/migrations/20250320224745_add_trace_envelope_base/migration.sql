/*
  Warnings:

  - Added the required column `envelope_base` to the `Trace` table without a default value. This is not possible if the table is not empty.
  - Made the column `duration` on table `Trace` required. This step will fail if there are existing NULL values in that column.
  - Made the column `envelope_data` on table `Trace` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rep_peaks` on table `Trace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Trace" ADD COLUMN     "envelope_base" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "envelope_data" SET NOT NULL,
ALTER COLUMN "rep_peaks" SET NOT NULL;
