import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { InternalServerError } from "./infra/errors/InternalServerError";
import { ApplicationError } from "./infra/errors/ApplicationError";
import { infraController } from "./routes/infraController";
import { userController } from "./routes/userController";
import { webserverModule } from "./models/webserver/WebserverModule";
import { sessionController } from "./routes/sessionController";
import { activationController } from "./routes/activationController";
import { organizationController } from "./routes/organizationController";
import { mapController } from "./routes/mapController";
import { libraryController } from "./routes/libraryController";

export function createServerInstance(
  opts: { log: "never" | "all" } = { log: "all" },
) {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Ankorar API",
        description: "API reference",
        version: "0.0.1",
      },
      servers: [{ url: "http://localhost:9090" }],
    },
    transform: jsonSchemaTransform,
  });

  app.register(ScalarApiReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "deepSpace",
      title: "Minha API Reference",
      hideClientButton: true,
      operationTitleSource: "path",
    },
  });

  app.register(fastifyCors, {
    origin: true,
    methods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE", "PUT"],
    credentials: true,
  });

  app.setErrorHandler((err, _request, reply) => {
    if (err instanceof ApplicationError) {
      return reply.status(err.statusCode).send({
        status: err.statusCode,
        error: err.toJson(),
      });
    }
    if (err instanceof Error) {
      console.error(err);

      const internalError = new InternalServerError({
        cause: err.message,
      });

      return reply.status(internalError.statusCode).send({
        status: internalError.statusCode,
        error: internalError.toJson(),
      });
    }

    console.error(err);
    reply.send(err);
  });

  const { Controller: controller, Webserver: webserver } = webserverModule;

  app.addHook("onRequest", async (request) =>
    controller.injectAnonymousOrUser({ request }),
  );

  infraController.convertRoutes(app, opts);
  userController.convertRoutes(app, opts);
  sessionController.convertRoutes(app, opts);
  activationController.convertRoutes(app, opts);
  organizationController.convertRoutes(app, opts);
  mapController.convertRoutes(app, opts);
  libraryController.convertRoutes(app, opts);

  return {
    ...app,
    run: async (port = 9090) => {
      await app.ready();
      app.swagger();

      await app.listen({ port });

      if (opts.log === "all") {
        console.log(`\n[✓] Ankorar API running in ${webserver.origin}`);
      }
    },
  };
}
