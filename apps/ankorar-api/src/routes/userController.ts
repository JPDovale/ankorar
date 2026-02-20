import { createUserRoute } from "../controllers/users/create";
import { getUserByIdRoute } from "../controllers/users/getUserById";
import { getUserRoute } from "../controllers/users/getUser";
import { listUsersRoute } from "../controllers/users/listUsers";
import { updateCurrentUserRoute } from "../controllers/users/updateCurrentUser";
import { updateUserPasswordRoute } from "../controllers/users/updateUserPassword";
import { updateUserSubscriptionRoute } from "../controllers/users/updateUserSubscription";
import { updateUserAiCreditsRoute } from "../controllers/users/updateUserAiCredits";
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
userController.appendRoute(updateUserPasswordRoute);
userController.appendRoute(updateUserSubscriptionRoute);
userController.appendRoute(updateUserAiCreditsRoute);
userController.appendRoute(updateCurrentUserRoute);

export { userController };
