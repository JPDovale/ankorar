import { useQuery } from "@tanstack/react-query";
import {
  listUserOrganizationsRequest,
  type OrganizationPreview,
} from "@/services/organizations/listUserOrganizationsRequest";

export const organizationsQueryKey = ["organizations"] as const;

async function getOrganizationsQueryFn(): Promise<OrganizationPreview[]> {
  const response = await listUserOrganizationsRequest();

  if (response.status === 200 && response.data?.organizations) {
    return response.data.organizations;
  }

  return [];
}

interface UseOrganizationsParams {
  enabled?: boolean;
}

export function useOrganizations(params: UseOrganizationsParams = {}) {
  const { enabled = true } = params;

  const organizationsQuery = useQuery({
    queryKey: organizationsQueryKey,
    queryFn: getOrganizationsQueryFn,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    organizations: organizationsQuery.data ?? [],
    isLoadingOrganizations: organizationsQuery.isPending,
    refetchOrganizations: organizationsQuery.refetch,
  };
}
