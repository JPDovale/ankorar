import { connectMapToLibraryRoute } from "../controllers/library/connectMapToLibrary";
import { createLibraryForOwnerRoute } from "../controllers/library/createLibraryForOwner";
import { createLibraryRoute } from "../controllers/library/createLibrary";
import { listLibrariesRoute } from "../controllers/library/listLibraries";
import { listMapsByLibraryIdsRoute } from "../controllers/library/listMapsByLibraryIds";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const libraryController = Controller.create({
  name: "Library",
  routeConversor: Route.fastifyRouterConversor,
});

libraryController.appendRoute(createLibraryRoute);
libraryController.appendRoute(createLibraryForOwnerRoute);
libraryController.appendRoute(listLibrariesRoute);
libraryController.appendRoute(listMapsByLibraryIdsRoute);
libraryController.appendRoute(connectMapToLibraryRoute);

export { libraryController };
