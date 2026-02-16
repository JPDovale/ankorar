import { createMap } from "./createMap";
import { deleteMap } from "./deleteMap";
import { createCentralNode } from "./fns/createCentralNode";
import { deleteMapLike } from "./fns/deleteMapLike";
import { extractCentralNodeTitle } from "./fns/extractCentralNodeTitle";
import { findMapById } from "./fns/findMapById";
import { findMapByIdAndMemberId } from "./fns/findMapByIdAndMemberId";
import { findMapByIdAndOrganizationId } from "./fns/findMapByIdAndOrganizationId";
import { findMapDetailsByIdAndOrganizationId } from "./fns/findMapDetailsByIdAndOrganizationId";
import { findMapLikeByMapIdAndMemberId } from "./fns/findMapLikeByMapIdAndMemberId";
import { findMapPreviewsByMemberId } from "./fns/findMapPreviewsByMemberId";
import { findMapsByMemberId } from "./fns/findMapsByMemberId";
import { getMapLikesInfo } from "./fns/getMapLikesInfo";
import { getMapsLikesInfo } from "./fns/getMapsLikesInfo";
import { likeMap } from "./fns/likeMap";
import { persistMap } from "./fns/persistMap";
import { persistMapLike } from "./fns/persistMapLike";
import { unlikeMap } from "./fns/unlikeMap";
import { updateMapNodeContent } from "./updateMapNodeContent";

const Maps = {
  create: createMap,
  updateNodeContent: updateMapNodeContent,
  delete: deleteMap,
  like: likeMap,
  unlike: unlikeMap,
  fns: {
    findById: findMapById,
    findByIdAndMemberId: findMapByIdAndMemberId,
    findByIdAndOrganizationId: findMapByIdAndOrganizationId,
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
