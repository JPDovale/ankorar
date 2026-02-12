import { createMapRoute } from "../controllers/map/createMap";
import { deleteMapRoute } from "../controllers/map/deleteMap";
import { getMapRoute } from "../controllers/map/getMap";
import { listMapsRoute } from "../controllers/map/listMaps";
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

export { mapController };
