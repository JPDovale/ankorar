import { createMapRoute } from "../controllers/map/createMap";
import { listMapsRoute } from "../controllers/map/listMaps";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const mapController = Controller.create({
  name: "Map",
  routeConversor: Route.fastifyRouterConversor,
});

mapController.appendRoute(createMapRoute);
mapController.appendRoute(listMapsRoute);

export { mapController };
