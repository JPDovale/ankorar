import { connectMap } from "./connectMap";
import { createLibrary } from "./createLibrary";
import { connectMapToLibrary } from "./fns/connectMapToLibrary";
import { countLibrariesByOrganizationId } from "./fns/countLibrariesByOrganizationId";
import { findLibrariesByOrganizationId } from "./fns/findLibrariesByOrganizationId";
import { findLibraryPreviewsByOrganizationId } from "./fns/findLibraryPreviewsByOrganizationId";
import { findLibraryPreviewsDataByOrganizationId } from "./fns/findLibraryPreviewsDataByOrganizationId";
import { findLibraryByIdAndOrganizationId } from "./fns/findLibraryByIdAndOrganizationId";
import { persistLibrary } from "./fns/persistLibrary";

const Libraries = {
  create: createLibrary,
  connectMap,
  fns: {
    countByOrganizationId: countLibrariesByOrganizationId,
    findByOrganizationId: findLibrariesByOrganizationId,
    findPreviewsByOrganizationId: findLibraryPreviewsByOrganizationId,
    findPreviewsDataByOrganizationId: findLibraryPreviewsDataByOrganizationId,
    findByIdAndOrganizationId: findLibraryByIdAndOrganizationId,
    connectMap: connectMapToLibrary,
    persist: persistLibrary,
  },
};

export { Libraries };
