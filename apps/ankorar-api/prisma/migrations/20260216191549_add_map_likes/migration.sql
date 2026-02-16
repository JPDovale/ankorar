-- CreateTable
CREATE TABLE "map_likes" (
    "map_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "map_likes_map_id_member_id_key" ON "map_likes"("map_id", "member_id");

-- AddForeignKey
ALTER TABLE "map_likes" ADD CONSTRAINT "map_likes_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_likes" ADD CONSTRAINT "map_likes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
