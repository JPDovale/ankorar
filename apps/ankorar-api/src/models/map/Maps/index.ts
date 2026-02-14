import { createMap } from "./createMap";
import { deleteMap } from "./deleteMap";
import { createCentralNode } from "./fns/createCentralNode";
import { extractCentralNodeTitle } from "./fns/extractCentralNodeTitle";
import { findMapById } from "./fns/findMapById";
import { findMapByIdAndMemberId } from "./fns/findMapByIdAndMemberId";
import { findMapByIdAndOrganizationId } from "./fns/findMapByIdAndOrganizationId";
import { findMapsByMemberId } from "./fns/findMapsByMemberId";
import { persistMap } from "./fns/persistMap";
import { updateMapNodeContent } from "./updateMapNodeContent";

const Maps = {
  create: createMap,
  updateNodeContent: updateMapNodeContent,
  delete: deleteMap,
  fns: {
    findById: findMapById,
    findByIdAndMemberId: findMapByIdAndMemberId,
    findByIdAndOrganizationId: findMapByIdAndOrganizationId,
    findByMemberId: findMapsByMemberId,
    createCentralNode,
    extractCentralNodeTitle,
    persist: persistMap,
  },
};

export { Maps };
