import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";
import { statusRoute } from "../controllers/infra/status";

const infraController = Controller.create({
  name: "Infra",
  routeConversor: Route.fastifyRouterConversor,
});

infraController.appendRoute(statusRoute);

export { infraController };
