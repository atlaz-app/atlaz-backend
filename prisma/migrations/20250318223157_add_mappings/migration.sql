/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Preset` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Preset` table. All the data in the column will be lost.
  - You are about to drop the column `avgIntensity` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveReps` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `envelopeData` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `peakIntensity` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `presetId` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `repPeaks` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `totalReps` on the `Trace` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Trace` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Preset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Trace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trace" DROP CONSTRAINT "Trace_presetId_fkey";

-- DropForeignKey
ALTER TABLE "Trace" DROP CONSTRAINT "Trace_userId_fkey";

-- DropIndex
DROP INDEX "Trace_presetId_idx";

-- DropIndex
DROP INDEX "Trace_userId_idx";

-- AlterTable
ALTER TABLE "Preset" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Trace" DROP COLUMN "avgIntensity",
DROP COLUMN "createdAt",
DROP COLUMN "effectiveReps",
DROP COLUMN "envelopeData",
DROP COLUMN "peakIntensity",
DROP COLUMN "presetId",
DROP COLUMN "repPeaks",
DROP COLUMN "totalReps",
DROP COLUMN "userId",
ADD COLUMN     "avg_intensity" DOUBLE PRECISION,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "effective_reps" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "envelope_data" JSONB,
ADD COLUMN     "peak_intensity" DOUBLE PRECISION,
ADD COLUMN     "preset_id" INTEGER,
ADD COLUMN     "rep_peaks" JSONB,
ADD COLUMN     "total_reps" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Trace_user_id_idx" ON "Trace"("user_id");

-- CreateIndex
CREATE INDEX "Trace_preset_id_idx" ON "Trace"("preset_id");

-- AddForeignKey
ALTER TABLE "Trace" ADD CONSTRAINT "Trace_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trace" ADD CONSTRAINT "Trace_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "Preset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
