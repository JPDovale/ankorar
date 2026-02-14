import { useSuspenseLibraries } from "@/hooks/useLibraries";
import { useSuspenseMaps } from "@/hooks/useMaps";

export function useHomeOrganizationLibrariesSection() {
  const { data: libraries } = useSuspenseLibraries();
  const { data: maps } = useSuspenseMaps();

  const ownMapIds = new Set(maps.map((map) => map.id));
  const organizationLibraries = libraries.map((library) => ({
    ...library,
    maps: library.maps ?? [],
  }));
  const organizationLibrariesCount = organizationLibraries.length;
  const linkedMapsCount = organizationLibraries.reduce(
    (total, library) => total + library.maps.length,
    0,
  );
  const organizationLibrariesText = `${organizationLibrariesCount} biblioteca${organizationLibrariesCount === 1 ? "" : "s"} na organização`;
  const linkedMapsText = `${linkedMapsCount} mapa${linkedMapsCount === 1 ? "" : "s"} vinculado${linkedMapsCount === 1 ? "" : "s"}`;

  return {
    linkedMapsText,
    organizationLibrariesText,
    organizationLibraries,
    ownMapIds,
  };
}
