import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";
import { loginRoute } from "../controllers/session/login";

const sessionController = Controller.create({
  name: "session",
  routeConversor: Route.fastifyRouterConversor,
});

sessionController.appendRoute(loginRoute);

export { sessionController };
