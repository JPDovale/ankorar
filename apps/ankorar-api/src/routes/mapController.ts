import { createMapForMemberRoute } from "../controllers/map/createMapForMember";
import { createMapFromAiForMemberRoute } from "../controllers/map/createMapFromAiForMember";
import { createMapFromAiRoute } from "../controllers/map/createMapFromAi";
import { createMapRoute } from "../controllers/map/createMap";
import { deepenMapNodeForMemberRoute } from "../controllers/map/deepenMapNodeForMember";
import { deepenMapNodeRoute } from "../controllers/map/deepenMapNode";
import { deleteMapForMemberRoute } from "../controllers/map/deleteMapForMember";
import { deleteMapRoute } from "../controllers/map/deleteMap";
import { getMapForMemberRoute } from "../controllers/map/getMapForMember";
import { getMapRoute } from "../controllers/map/getMap";
import { listMapsForMemberRoute } from "../controllers/map/listMapsForMember";
import { likeMapForMemberRoute } from "../controllers/map/likeMapForMember";
import { likeMapRoute } from "../controllers/map/likeMap";
import { listMapsRoute } from "../controllers/map/listMaps";
import { unlikeMapForMemberRoute } from "../controllers/map/unlikeMapForMember";
import { unlikeMapRoute } from "../controllers/map/unlikeMap";
import { updateMapContentRoute } from "../controllers/map/updateMapContent";
import { updateMapForMemberRoute } from "../controllers/map/updateMapForMember";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const mapController = Controller.create({
  name: "Map",
  routeConversor: Route.fastifyRouterConversor,
});

mapController.appendRoute(createMapRoute);
mapController.appendRoute(createMapFromAiRoute);
mapController.appendRoute(deepenMapNodeRoute);
mapController.appendRoute(createMapForMemberRoute);
mapController.appendRoute(createMapFromAiForMemberRoute);
mapController.appendRoute(deepenMapNodeForMemberRoute);
mapController.appendRoute(listMapsRoute);
mapController.appendRoute(listMapsForMemberRoute);
mapController.appendRoute(getMapRoute);
mapController.appendRoute(getMapForMemberRoute);
mapController.appendRoute(updateMapContentRoute);
mapController.appendRoute(updateMapForMemberRoute);
mapController.appendRoute(deleteMapRoute);
mapController.appendRoute(deleteMapForMemberRoute);
mapController.appendRoute(likeMapRoute);
mapController.appendRoute(likeMapForMemberRoute);
mapController.appendRoute(unlikeMapRoute);
mapController.appendRoute(unlikeMapForMemberRoute);

export { mapController };
