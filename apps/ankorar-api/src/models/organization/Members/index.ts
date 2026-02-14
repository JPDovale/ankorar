import { createMember } from "./createMember";
import { findMemberById } from "./fns/findMemberById";
import { findMemberByUserIdAndOrgId } from "./fns/findMemberByUserIdAndOrgId";
import { persistMember } from "./fns/persistMember";

const Members = {
  create: createMember,
  fns: {
    findById: findMemberById,
    findByUserIdAndOrgId: findMemberByUserIdAndOrgId,
    persist: persistMember,
  },
};

export { Members };
