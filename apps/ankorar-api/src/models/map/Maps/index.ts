import { createForMember } from "./createForMember";
import { createMap } from "./createMap";
import { deleteForMember } from "./deleteForMember";
import { deleteMap } from "./deleteMap";
import { createCentralNode } from "./fns/createCentralNode";
import { deleteMapLike } from "./fns/deleteMapLike";
import { extractCentralNodeTitle } from "./fns/extractCentralNodeTitle";
import { findMapById } from "./fns/findMapById";
import { findMapByIdAndMemberId } from "./fns/findMapByIdAndMemberId";
import { findMapByIdAndOrganizationId } from "./fns/findMapByIdAndOrganizationId";
import { findMapDetailsByIdAndMemberId } from "./fns/findMapDetailsByIdAndMemberId";
import { findMapDetailsByIdAndOrganizationId } from "./fns/findMapDetailsByIdAndOrganizationId";
import { findMapLikeByMapIdAndMemberId } from "./fns/findMapLikeByMapIdAndMemberId";
import { findMapPreviewsByMemberId } from "./fns/findMapPreviewsByMemberId";
import { findMapsByMemberId } from "./fns/findMapsByMemberId";
import { getMapLikesInfo } from "./fns/getMapLikesInfo";
import { getMapsLikesInfo } from "./fns/getMapsLikesInfo";
import { likeForMember } from "./likeForMember";
import { likeMap } from "./fns/likeMap";
import { persistMap } from "./fns/persistMap";
import { persistMapLike } from "./fns/persistMapLike";
import { unlikeMap } from "./fns/unlikeMap";
import { unlikeForMember } from "./unlikeForMember";
import { updateForMember } from "./updateForMember";
import { updateMapNodeContent } from "./updateMapNodeContent";

const Maps = {
  create: createMap,
  createForMember,
  updateNodeContent: updateMapNodeContent,
  updateForMember,
  delete: deleteMap,
  deleteForMember,
  like: likeMap,
  likeForMember,
  unlike: unlikeMap,
  unlikeForMember,
  fns: {
    findById: findMapById,
    findByIdAndMemberId: findMapByIdAndMemberId,
    findByIdAndOrganizationId: findMapByIdAndOrganizationId,
    findDetailsByIdAndMemberId: findMapDetailsByIdAndMemberId,
    findDetailsByIdAndOrganizationId: findMapDetailsByIdAndOrganizationId,
    findByMemberId: findMapsByMemberId,
    findPreviewsByMemberId: findMapPreviewsByMemberId,
    findMapLikeByMapIdAndMemberId,
    getMapLikesInfo,
    getMapsLikesInfo,
    createCentralNode,
    extractCentralNodeTitle,
    persist: persistMap,
    persistMapLike,
    deleteMapLike,
  },
};

export { Maps };
