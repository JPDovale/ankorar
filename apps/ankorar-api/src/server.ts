import { infraController } from "./routes/infraController";
import { userController } from "./routes/userController";
import { sessionController } from "./routes/sessionController";
import { activationController } from "./routes/activationController";
import { organizationController } from "./routes/organizationController";
import { mapController } from "./routes/mapController";
import { libraryController } from "./routes/libraryController";
import { Server } from "./infra/shared/entities/Server";
import { ActivationModule } from "./models/activation/ActivationModule";
import { AuthModule } from "./models/auth/AuthModule";
import { CryptoModule } from "./models/crypto/CryptoModule";
import { DateModule } from "./models/date/DateModule";
import { EmailModule } from "./models/email/EmailModule";
import { LibraryModule } from "./models/library/LibraryModule";
import { MapModule } from "./models/map/MapModule";
import { OrganizationModule } from "./models/organization/OrganizationModule";
import { SessionModule } from "./models/session/SessionModule";
import { UserModule } from "./models/user/UserModule";
import { WebserverModule } from "./models/webserver/WebserverModule";

export function createServerInstance(
  opts: { log: "never" | "all" } = { log: "all" },
) {
  const server = Server.create({
    name: "Ankorar API",
    opts: {
      log: opts.log,
    },
    controllerConversor: Server.fastifyControllerConversor,
  });

  server.appendModule(WebserverModule);
  server.appendModule(UserModule);
  server.appendModule(SessionModule);
  server.appendModule(ActivationModule);
  server.appendModule(OrganizationModule);
  server.appendModule(MapModule);
  server.appendModule(LibraryModule);
  server.appendModule(AuthModule);
  server.appendModule(CryptoModule);
  server.appendModule(DateModule);
  server.appendModule(EmailModule);

  const { Controller, Webserver } = server.modules.webserver;
  server.setOrigin(Webserver.origin);

  server.appendController(infraController);
  server.appendController(userController);
  server.appendController(sessionController);
  server.appendController(activationController);
  server.appendController(organizationController);
  server.appendController(mapController);
  server.appendController(libraryController);

  server.addOnRequestHook((request, reply) =>
    Controller.injectAnonymousOrUser({ request, reply }),
  );

  return server;
}
