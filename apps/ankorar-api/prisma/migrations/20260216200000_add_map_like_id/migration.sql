-- AlterTable
ALTER TABLE "map_likes" ADD COLUMN "id" TEXT;

-- Backfill id for existing rows (PostgreSQL 13+ has gen_random_uuid())
UPDATE "map_likes" SET "id" = gen_random_uuid()::text WHERE "id" IS NULL;

-- Make id NOT NULL and add primary key
ALTER TABLE "map_likes" ALTER COLUMN "id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "map_likes_id_key" ON "map_likes"("id");

-- AddPrimaryKey (replace table unique constraint by primary key on id)
ALTER TABLE "map_likes" ADD PRIMARY KEY ("id");
