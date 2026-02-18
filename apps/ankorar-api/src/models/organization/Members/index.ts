import { createMember } from "./createMember";
import { findMemberById } from "./fns/findMemberById";
import { findMemberByUserIdAndOrgId } from "./fns/findMemberByUserIdAndOrgId";
import { findMembersByOrganizationId } from "./fns/findMembersByOrganizationId";
import { findMembersByUserId } from "./fns/findMembersByUserId";
import { persistMember } from "./fns/persistMember";
import { removeMember } from "./fns/removeMember";
import { updateMembersFeaturesForUser } from "./fns/updateMembersFeaturesForUser";

const Members = {
  create: createMember,
  remove: removeMember,
  fns: {
    findById: findMemberById,
    findByUserIdAndOrgId: findMemberByUserIdAndOrgId,
    findByOrganizationId: findMembersByOrganizationId,
    findByUserId: findMembersByUserId,
    persist: persistMember,
    updateFeaturesForUser: updateMembersFeaturesForUser,
  },
};

export { Members };
