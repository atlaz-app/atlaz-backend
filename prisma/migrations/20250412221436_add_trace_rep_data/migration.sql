-- AlterTable
ALTER TABLE "Trace" ADD COLUMN     "rep_data" JSONB NOT NULL DEFAULT '{ "hello": "world" }';
