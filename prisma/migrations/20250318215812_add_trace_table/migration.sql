-- CreateEnum
CREATE TYPE "TrackerMode" AS ENUM ('HYPERTROPHY', 'STRENGTH');

-- AlterTable
ALTER TABLE "Preset" ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Trace" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "presetId" INTEGER,
    "muscle" TEXT NOT NULL,
    "duration" INTEGER,
    "mode" "TrackerMode" NOT NULL,
    "visual" BOOLEAN NOT NULL DEFAULT false,
    "totalReps" INTEGER NOT NULL DEFAULT 0,
    "effectiveReps" INTEGER NOT NULL DEFAULT 0,
    "effectiveness" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "peakIntensity" DOUBLE PRECISION,
    "avgIntensity" DOUBLE PRECISION,
    "envelopeData" JSONB,
    "repPeaks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Trace_userId_idx" ON "Trace"("userId");

-- CreateIndex
CREATE INDEX "Trace_presetId_idx" ON "Trace"("presetId");

-- AddForeignKey
ALTER TABLE "Trace" ADD CONSTRAINT "Trace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trace" ADD CONSTRAINT "Trace_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "Preset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
