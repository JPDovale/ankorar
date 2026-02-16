import { acceptOrganizationInvite } from "./acceptOrganizationInvite";
import { cancelOrganizationInvite } from "./cancelOrganizationInvite";
import { createOrganization } from "./createOrganization";
import { createOrganizationForUser } from "./createOrganizationForUser";
import { createOrganizationInvite } from "./createOrganizationInvite";
import { listPendingOrganizationInvitesByUserId } from "./listPendingOrganizationInvitesByUserId";
import { rejectOrganizationInvite } from "./rejectOrganizationInvite";
import { upsertOrganizationMember } from "./upsertOrganizationMember";
import { findOrganizationByCreatorId } from "./fns/findOrganizationByCreatorId";
import { findOrganizationById } from "./fns/findOrganizationById";
import { findOrganizationsByUserId } from "./fns/findOrganizationsByUserId";
import { findPendingInvitesByOrganizationId } from "./fns/findPendingInvitesByOrganizationId";
import { persistOrganization } from "./fns/persistOrganization";

const Organizations = {
  create: createOrganization,
  createForUser: createOrganizationForUser,
  upsertMember: upsertOrganizationMember,
  createInvite: createOrganizationInvite,
  cancelInvite: cancelOrganizationInvite,
  listPendingInvitesByUserId: listPendingOrganizationInvitesByUserId,
  acceptInvite: acceptOrganizationInvite,
  rejectInvite: rejectOrganizationInvite,
  fns: {
    findById: findOrganizationById,
    findByUserId: findOrganizationsByUserId,
    persist: persistOrganization,
    findByCreatorId: findOrganizationByCreatorId,
    findPendingInvitesByOrganizationId,
  },
};

export type { OrganizationInvitePreview } from "./types";
export { Organizations };
