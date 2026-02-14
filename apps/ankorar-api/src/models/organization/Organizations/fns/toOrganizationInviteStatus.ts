import { OrganizationInviteStatus } from "../OrganizationInvite";

type ToOrganizationInviteStatusInput = {
  status: string;
};

type ToOrganizationInviteStatusResponse = OrganizationInviteStatus;

export function toOrganizationInviteStatus({
  status,
}: ToOrganizationInviteStatusInput): ToOrganizationInviteStatusResponse {
  if (status === "accepted" || status === "rejected") {
    return status;
  }

  return "pending";
}
