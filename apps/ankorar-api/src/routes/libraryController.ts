import { connectMapToLibraryRoute } from "../controllers/library/connectMapToLibrary";
import { createLibraryRoute } from "../controllers/library/createLibrary";
import { listLibrariesRoute } from "../controllers/library/listLibraries";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const libraryController = Controller.create({
  name: "Library",
  routeConversor: Route.fastifyRouterConversor,
});

libraryController.appendRoute(createLibraryRoute);
libraryController.appendRoute(listLibrariesRoute);
libraryController.appendRoute(connectMapToLibraryRoute);

export { libraryController };
