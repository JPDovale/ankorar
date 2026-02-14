import { db } from "@/src/infra/database/pool";

type ConnectMapToLibraryInput = {
  mapId: string;
  libraryId: string;
};

type ConnectMapToLibraryResponse = void;

export async function connectMapToLibrary({
  mapId,
  libraryId,
}: ConnectMapToLibraryInput): Promise<ConnectMapToLibraryResponse> {
  await db.mapLibrary.createMany({
    data: [
      {
        map_id: mapId,
        library_id: libraryId,
      },
    ],
    skipDuplicates: true,
  });
}
