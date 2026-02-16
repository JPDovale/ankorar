import { createMapRoute } from "../controllers/map/createMap";
import { deleteMapRoute } from "../controllers/map/deleteMap";
import { getMapRoute } from "../controllers/map/getMap";
import { likeMapRoute } from "../controllers/map/likeMap";
import { listMapsRoute } from "../controllers/map/listMaps";
import { unlikeMapRoute } from "../controllers/map/unlikeMap";
import { updateMapContentRoute } from "../controllers/map/updateMapContent";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const mapController = Controller.create({
  name: "Map",
  routeConversor: Route.fastifyRouterConversor,
});

mapController.appendRoute(createMapRoute);
mapController.appendRoute(listMapsRoute);
mapController.appendRoute(getMapRoute);
mapController.appendRoute(updateMapContentRoute);
mapController.appendRoute(deleteMapRoute);
mapController.appendRoute(likeMapRoute);
mapController.appendRoute(unlikeMapRoute);

export { mapController };
