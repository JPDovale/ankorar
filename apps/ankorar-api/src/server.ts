import { Readable } from "stream";
import { infraController } from "./routes/infraController";
import { userController } from "./routes/userController";
import { sessionController } from "./routes/sessionController";
import { activationController } from "./routes/activationController";
import { organizationController } from "./routes/organizationController";
import { mapController } from "./routes/mapController";
import { libraryController } from "./routes/libraryController";
import { dashboardController } from "./routes/dashboardController";
import { subscriptionController } from "./routes/subscriptionController";
import { Server } from "./infra/shared/entities/Server";
import { ActivationModule } from "./models/activation/ActivationModule";
import { AuthModule } from "./models/auth/AuthModule";
import { CryptoModule } from "./models/crypto/CryptoModule";
import { DateModule } from "./models/date/DateModule";
import { EmailModule } from "./models/email/EmailModule";
import { LibraryModule } from "./models/library/LibraryModule";
import { MapModule } from "./models/map/MapModule";
import { OpenAiModule } from "./models/openai/OpenAiModule";
import { OrganizationModule } from "./models/organization/OrganizationModule";
import { SessionModule } from "./models/session/SessionModule";
import { StripeModule } from "./models/stripe/StripeModule";
import { UserModule } from "./models/user/UserModule";
import { WebserverModule } from "./models/webserver/WebserverModule";
import { STRIPE_WEBHOOK_PATH } from "./controllers/subscription/stripeWebhook";

export function createServerInstance(
  opts: { log: "never" | "all" } = { log: "all" },
) {
  const server = Server.create({
    name: "Ankorar API",
    opts: {
      log: opts.log,
      cors: {
        origin: "*",
        credentials: true,
        methods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE", "PUT"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "Accept",
          "X-Api-Key",
          "X-Library-Id",
        ],
        exposedHeaders: [
          "X-Page",
          "x-Pages",
          "x-Per-page",
          "x-Next-page",
          "x-Total",
          "X-Location",
        ],
      },
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
  server.appendModule(StripeModule);
  server.appendModule(OpenAiModule);

  const { Controller, Webserver } = server.modules.webserver;
  server.setOrigin(Webserver.origin);

  server.addPreParsingHook((request, payload, done) => {
    const path = request.url?.split("?")[0] ?? "";
    if (path !== STRIPE_WEBHOOK_PATH) {
      done(null, payload as Readable);
      return;
    }
    const chunks: Buffer[] = [];
    payload.on("data", (chunk: Buffer) => chunks.push(chunk));
    payload.on("end", () => {
      const buf = Buffer.concat(chunks);
      (request as { rawBody?: Buffer }).rawBody = buf;
      done(null, Readable.from(buf));
    });
    payload.on("error", (err) => done(err, undefined));
  });

  server.appendController(infraController);
  server.appendController(userController);
  server.appendController(sessionController);
  server.appendController(activationController);
  server.appendController(organizationController);
  server.appendController(mapController);
  server.appendController(libraryController);
  server.appendController(subscriptionController);
  server.appendController(dashboardController);

  server.addOnRequestHook((request, reply) =>
    Controller.injectAnonymousOrUser({ request, reply }),
  );

  return server;
}
