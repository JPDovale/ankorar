import { useOrganizationApiKeys } from "./useOrganizationApiKeys";
import { useOrganizationIdentity } from "./useOrganizationIdentity";
import { useOrganizationMembers } from "./useOrganizationMembers";

export type {
  OrganizationApiKey,
  OrganizationApiKeyEnvironment,
  OrganizationApiKeyStatus,
  OrganizationMember,
  OrganizationMemberRole,
  OrganizationMemberStatus,
  OrganizationMemberType,
} from "../models";

export function useOrganizationSettingsPage() {
  const identity = useOrganizationIdentity();
  const apiKeys = useOrganizationApiKeys();
  const members = useOrganizationMembers();

  return {
    ...identity,
    ...apiKeys,
    ...members,
  };
}
