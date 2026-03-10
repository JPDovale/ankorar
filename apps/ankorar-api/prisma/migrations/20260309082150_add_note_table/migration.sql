-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "member_id" TEXT NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_likes" (
    "id" TEXT NOT NULL,
    "note_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes_relations" (
    "from_note_id" TEXT NOT NULL,
    "to_note_id" TEXT NOT NULL,

    CONSTRAINT "notes_relations_pkey" PRIMARY KEY ("from_note_id","to_note_id")
);

-- CreateTable
CREATE TABLE "notes_libraries" (
    "note_id" TEXT NOT NULL,
    "library_id" TEXT NOT NULL,

    CONSTRAINT "notes_libraries_pkey" PRIMARY KEY ("note_id","library_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notes_id_key" ON "notes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "note_likes_id_key" ON "note_likes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "note_likes_note_id_member_id_key" ON "note_likes"("note_id", "member_id");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_likes" ADD CONSTRAINT "note_likes_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_likes" ADD CONSTRAINT "note_likes_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_relations" ADD CONSTRAINT "notes_relations_from_note_id_fkey" FOREIGN KEY ("from_note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_relations" ADD CONSTRAINT "notes_relations_to_note_id_fkey" FOREIGN KEY ("to_note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_libraries" ADD CONSTRAINT "notes_libraries_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes_libraries" ADD CONSTRAINT "notes_libraries_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "libraries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
