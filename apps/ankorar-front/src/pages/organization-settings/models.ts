export type OrganizationApiKeyEnvironment = "live" | "test";
export type OrganizationApiKeyStatus = "active" | "revoked";

export interface OrganizationApiKey {
  id: string;
  prefix: string;
  partialKey: string;
  env: OrganizationApiKeyEnvironment;
  features: string[];
  status: OrganizationApiKeyStatus;
  createdAtLabel: string;
  lastUsedAtLabel: string;
  /** ISO date string or null for permanent */
  expiresAt: string | null;
  expiresAtLabel: string;
  /** true when expiresAt is set and in the past */
  isExpired: boolean;
}

export type OrganizationMemberRole = "owner" | "admin" | "member";
export type OrganizationMemberStatus = "active" | "invited";
export type OrganizationMemberType = "member" | "invite";

export interface OrganizationMember {
  id: string;
  type: OrganizationMemberType;
  name: string;
  email: string;
  role: OrganizationMemberRole;
  status: OrganizationMemberStatus;
}
