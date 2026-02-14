import { useSuspenseLibraries } from "@/hooks/useLibraries";
import { useSuspenseMaps } from "@/hooks/useMaps";
import { useState } from "react";

export function useHomeOrganizationLibrariesSection() {
  const { data: libraries } = useSuspenseLibraries();
  const { data: maps } = useSuspenseMaps();
  const [selectedOrganizationLibraryId, setSelectedOrganizationLibraryId] = useState("");

  const ownMapIds = new Set(maps.map((map) => map.id));
  const organizationLibraries = libraries.map((library) => ({
    ...library,
    maps: library.maps ?? [],
  }));
  const activeOrganizationLibrary =
    organizationLibraries.find((library) => library.id === selectedOrganizationLibraryId) ??
    organizationLibraries[0] ??
    null;
  const activeOrganizationLibraryMaps = activeOrganizationLibrary?.maps ?? [];
  const linkedMapsCount = activeOrganizationLibraryMaps.length;
  const linkedMapsText = `${linkedMapsCount} mapa${linkedMapsCount === 1 ? "" : "s"} vinculado${linkedMapsCount === 1 ? "" : "s"}`;

  return {
    activeOrganizationLibrary,
    activeOrganizationLibraryMaps,
    linkedMapsText,
    organizationLibraries,
    ownMapIds,
    setSelectedOrganizationLibraryId,
  };
}
