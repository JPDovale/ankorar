import { createMember } from "./createMember";
import { findMemberById } from "./fns/findMemberById";
import { findMemberByUserIdAndOrgId } from "./fns/findMemberByUserIdAndOrgId";
import { findMembersByOrganizationId } from "./fns/findMembersByOrganizationId";
import { persistMember } from "./fns/persistMember";
import { removeMember } from "./fns/removeMember";

const Members = {
  create: createMember,
  remove: removeMember,
  fns: {
    findById: findMemberById,
    findByUserIdAndOrgId: findMemberByUserIdAndOrgId,
    findByOrganizationId: findMembersByOrganizationId,
    persist: persistMember,
  },
};

export { Members };
