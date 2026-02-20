import { createUserRoute } from "../controllers/users/create";
import { getUserByIdRoute } from "../controllers/users/getUserById";
import { getUserRoute } from "../controllers/users/getUser";
import { listUsersRoute } from "../controllers/users/listUsers";
import { updateUserRoute } from "../controllers/users/update";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const userController = Controller.create({
  name: "user",
  routeConversor: Route.fastifyRouterConversor,
});

userController.appendRoute(createUserRoute);
userController.appendRoute(listUsersRoute);
userController.appendRoute(getUserByIdRoute);
userController.appendRoute(getUserRoute);
userController.appendRoute(updateUserRoute);

export { userController };
