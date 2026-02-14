type NormalizeOrganizationInviteEmailInput = {
  email: string;
};

type NormalizeOrganizationInviteEmailResponse = string;

export function normalizeOrganizationInviteEmail({
  email,
}: NormalizeOrganizationInviteEmailInput): NormalizeOrganizationInviteEmailResponse {
  return email.trim().toLowerCase();
}
