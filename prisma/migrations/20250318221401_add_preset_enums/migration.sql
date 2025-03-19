/*
  Warnings:

  - You are about to drop the column `optimization` on the `Preset` table. All the data in the column will be lost.
  - Added the required column `visual` to the `Preset` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `mode` on the `Preset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `muscle` on the `Preset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `muscle` on the `Trace` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `visual` on the `Trace` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TrackerMuscle" AS ENUM ('BICEPS', 'TRICEPS', 'DELTOID');

-- CreateEnum
CREATE TYPE "TrackerVisual" AS ENUM ('ON', 'OFF');

-- AlterTable
ALTER TABLE "Preset" DROP COLUMN "optimization",
ADD COLUMN     "visual" "TrackerVisual" NOT NULL,
DROP COLUMN "mode",
ADD COLUMN     "mode" "TrackerMode" NOT NULL,
DROP COLUMN "muscle",
ADD COLUMN     "muscle" "TrackerMuscle" NOT NULL;

-- AlterTable
ALTER TABLE "Trace" DROP COLUMN "muscle",
ADD COLUMN     "muscle" "TrackerMuscle" NOT NULL,
DROP COLUMN "visual",
ADD COLUMN     "visual" "TrackerVisual" NOT NULL;
