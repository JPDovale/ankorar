export type OrganizationApiKeyEnvironment = "development" | "production";
export type OrganizationApiKeyStatus = "active" | "revoked";

export interface OrganizationApiKey {
  id: string;
  name: string;
  prefix: string;
  environment: OrganizationApiKeyEnvironment;
  status: OrganizationApiKeyStatus;
  createdAtLabel: string;
  lastUsedAtLabel: string;
}

export type OrganizationMemberRole = "owner" | "admin" | "member";
export type OrganizationMemberStatus = "active" | "invited";

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: OrganizationMemberRole;
  status: OrganizationMemberStatus;
}
