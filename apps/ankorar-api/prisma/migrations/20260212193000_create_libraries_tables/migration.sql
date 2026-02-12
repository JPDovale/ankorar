-- CreateTable
CREATE TABLE "libraries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "libraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maps_libraries" (
    "map_id" TEXT NOT NULL,
    "library_id" TEXT NOT NULL,

    CONSTRAINT "maps_libraries_pkey" PRIMARY KEY ("map_id","library_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "libraries_id_key" ON "libraries"("id");

-- AddForeignKey
ALTER TABLE "libraries" ADD CONSTRAINT "libraries_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maps_libraries" ADD CONSTRAINT "maps_libraries_map_id_fkey" FOREIGN KEY ("map_id") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maps_libraries" ADD CONSTRAINT "maps_libraries_library_id_fkey" FOREIGN KEY ("library_id") REFERENCES "libraries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
