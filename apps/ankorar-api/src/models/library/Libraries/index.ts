import { connectMap } from "./connectMap";
import { createLibrary } from "./createLibrary";
import { connectMapToLibrary } from "./fns/connectMapToLibrary";
import { findLibrariesByOrganizationId } from "./fns/findLibrariesByOrganizationId";
import { findLibrariesByOrganizationIdWithMaps } from "./fns/findLibrariesByOrganizationIdWithMaps";
import { findLibraryByIdAndOrganizationId } from "./fns/findLibraryByIdAndOrganizationId";
import { persistLibrary } from "./fns/persistLibrary";

const Libraries = {
  create: createLibrary,
  connectMap,
  fns: {
    findByOrganizationId: findLibrariesByOrganizationId,
    findByOrganizationIdWithMaps: findLibrariesByOrganizationIdWithMaps,
    findByIdAndOrganizationId: findLibraryByIdAndOrganizationId,
    connectMap: connectMapToLibrary,
    persist: persistLibrary,
  },
};

export { Libraries };
