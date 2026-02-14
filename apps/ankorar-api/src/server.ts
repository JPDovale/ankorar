import { infraController } from "./routes/infraController";
import { userController } from "./routes/userController";
import { webserverModule } from "./models/webserver/WebserverModule";
import { sessionController } from "./routes/sessionController";
import { activationController } from "./routes/activationController";
import { organizationController } from "./routes/organizationController";
import { mapController } from "./routes/mapController";
import { libraryController } from "./routes/libraryController";
import { Server } from "./infra/shared/entities/Server";

export function createServerInstance(
  opts: { log: "never" | "all" } = { log: "all" },
) {
  const { Controller, Webserver } = webserverModule;

  const server = Server.create({
    name: "Ankorar API",
    opts: {
      log: opts.log,
      origin: Webserver.origin,
    },
    controllerConversor: Server.fastifyControllerConversor,
  });

  server.appendController(infraController);
  server.appendController(userController);
  server.appendController(sessionController);
  server.appendController(activationController);
  server.appendController(organizationController);
  server.appendController(mapController);
  server.appendController(libraryController);

  server.addOnRequestHook((request) =>
    Controller.injectAnonymousOrUser({ request }),
  );

  return server;
}
