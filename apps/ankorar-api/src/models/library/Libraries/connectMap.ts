import { Library } from "./Library";
import { connectMapToLibrary } from "./fns/connectMapToLibrary";
import { findLibraryByIdAndOrganizationId } from "./fns/findLibraryByIdAndOrganizationId";

type ConnectMapInput = {
  id: string;
  organizationId: string;
  mapId: string;
};

type ConnectMapResponse = {
  library: Library;
};

export async function connectMap({
  id,
  organizationId,
  mapId,
}: ConnectMapInput): Promise<ConnectMapResponse> {
  const { library } = await findLibraryByIdAndOrganizationId({
    id,
    organizationId,
  });

  await connectMapToLibrary({
    mapId,
    libraryId: library.id,
  });

  return { library };
}
