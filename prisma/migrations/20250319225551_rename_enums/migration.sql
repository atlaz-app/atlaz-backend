/*
  Warnings:

  - The values [HYPERTROPHY,STRENGTH] on the enum `TrackerMode` will be removed. If these variants are still used in the database, this will fail.
  - The values [BICEPS,TRICEPS,DELTOID] on the enum `TrackerMuscle` will be removed. If these variants are still used in the database, this will fail.
  - The values [ON,OFF] on the enum `TrackerVisual` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TrackerMode_new" AS ENUM ('Hypertrophy', 'Strength');
ALTER TABLE "Preset" ALTER COLUMN "mode" TYPE "TrackerMode_new" USING ("mode"::text::"TrackerMode_new");
ALTER TABLE "Trace" ALTER COLUMN "mode" TYPE "TrackerMode_new" USING ("mode"::text::"TrackerMode_new");
ALTER TYPE "TrackerMode" RENAME TO "TrackerMode_old";
ALTER TYPE "TrackerMode_new" RENAME TO "TrackerMode";
DROP TYPE "TrackerMode_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TrackerMuscle_new" AS ENUM ('Biceps', 'Triceps', 'Deltoid');
ALTER TABLE "Preset" ALTER COLUMN "muscle" TYPE "TrackerMuscle_new" USING ("muscle"::text::"TrackerMuscle_new");
ALTER TABLE "Trace" ALTER COLUMN "muscle" TYPE "TrackerMuscle_new" USING ("muscle"::text::"TrackerMuscle_new");
ALTER TYPE "TrackerMuscle" RENAME TO "TrackerMuscle_old";
ALTER TYPE "TrackerMuscle_new" RENAME TO "TrackerMuscle";
DROP TYPE "TrackerMuscle_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TrackerVisual_new" AS ENUM ('On', 'Off');
ALTER TABLE "Preset" ALTER COLUMN "visual" TYPE "TrackerVisual_new" USING ("visual"::text::"TrackerVisual_new");
ALTER TABLE "Trace" ALTER COLUMN "visual" TYPE "TrackerVisual_new" USING ("visual"::text::"TrackerVisual_new");
ALTER TYPE "TrackerVisual" RENAME TO "TrackerVisual_old";
ALTER TYPE "TrackerVisual_new" RENAME TO "TrackerVisual";
DROP TYPE "TrackerVisual_old";
COMMIT;
