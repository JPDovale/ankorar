import fastifyCors, { type FastifyCorsOptions } from "@fastify/cors";
import fastifySwagger, {
  type FastifyDynamicSwaggerOptions,
} from "@fastify/swagger";
import ScalarApiReference, {
  type FastifyApiReferenceOptions,
} from "@scalar/fastify-api-reference";
import type { FastifyRequest } from "fastify";
import fastify from "fastify";
import { Readable } from "stream";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ApplicationError } from "../../errors/ApplicationError";
import { InternalServerError } from "../../errors/InternalServerError";
import { FastifyTypedInstance } from "../../http/types/fastify";
import {
  AppModuleClass,
  AppModules,
  setActiveModules,
} from "./Modules";

type ControllerConvertOptions = {
  log: "never" | "all";
  modules: AppModules;
};

type ControllerConvertInputOptions = {
  log: "never" | "all";
};

interface AppController {
  name: string;
  convertRoutes(
    app: FastifyTypedInstance,
    opts: ControllerConvertOptions,
  ): void;
}

interface ServerDocsOptions {
  swagger: FastifyDynamicSwaggerOptions;
  scalar: FastifyApiReferenceOptions;
}

interface ServerOptions {
  log?: "never" | "all";
  origin?: string;
  docs?: ServerDocsOptions | false;
  cors?: FastifyCorsOptions | false;
}

interface ResolvedServerOptions {
  log: "never" | "all";
  origin?: string;
  docs: ServerDocsOptions | false;
  cors: FastifyCorsOptions | false;
}

interface CreateServerProps {
  name: string;
  opts?: ServerOptions;
  controllerConversor: (
    app: FastifyTypedInstance,
    controller: AppController,
    opts: ControllerConvertOptions,
  ) => void;
}

export class Server {
  name: string;
  controllers: AppController[] = [];
  controllerConversor: (
    app: FastifyTypedInstance,
    controller: AppController,
    opts: ControllerConvertOptions,
  ) => void;

  private app: FastifyTypedInstance;
  private opts: ResolvedServerOptions;
  private modulesStore: Partial<AppModules> = {};
  private didConvertRoutes = false;

  protected constructor({
    name,
    opts,
    controllerConversor,
  }: CreateServerProps) {
    this.name = name;
    this.opts = this.resolveOptions(opts);
    this.controllerConversor = controllerConversor;
    this.app = fastify().withTypeProvider<ZodTypeProvider>();

    this.app.setValidatorCompiler(validatorCompiler);
    this.app.setSerializerCompiler(serializerCompiler);
    this.registerDefaultErrorHandler();

    this.registerDocumentation();
    this.registerCors();
  }

  static create(props: CreateServerProps) {
    return new Server(props);
  }

  get instance() {
    return this.app;
  }

  get modules() {
    return this.modulesStore as AppModules;
  }

  appendModule<TKey extends keyof AppModules & string>(
    moduleClass: AppModuleClass<TKey, AppModules[TKey]>,
  ) {
    this.modulesStore[moduleClass.moduleKey] = moduleClass.create();

    if (this.opts.log === "all") {
      console.log(`[V] Register module ${moduleClass.moduleKey}`);
    }

    this.syncActiveModules();
  }

  appendController(controller: AppController) {
    this.controllers.push(controller);
  }

  setErrorHandler(
    handler: Parameters<FastifyTypedInstance["setErrorHandler"]>[0],
  ) {
    this.app.setErrorHandler(handler);
  }

  addOnRequestHook(
    handler: (
      request: FastifyRequest,
      reply: import("fastify").FastifyReply,
    ) => Promise<void> | void,
  ) {
    this.app.addHook("onRequest", async (request, reply) =>
      handler(request, reply),
    );
  }

  addPreParsingHook(
    handler: (
      request: FastifyRequest,
      payload: Readable,
      done: (err: Error | null, stream?: Readable) => void,
    ) => void,
  ) {
    this.app.addHook(
      "preParsing",
      (request, _reply, payload: import("stream").Readable, done) =>
        handler(request, payload as Readable, done),
    );
  }

  setOrigin(origin: string) {
    this.opts.origin = origin;
  }

  convertRoutes(
    opts: ControllerConvertInputOptions = { log: this.opts.log },
  ) {
    if (this.didConvertRoutes) {
      return;
    }

    this.syncActiveModules();
    const conversorOptions: ControllerConvertOptions = {
      ...opts,
      modules: this.modules,
    };

    this.controllers.forEach((controller) => {
      if (opts.log === "all") {
        console.log(`\n[V] Register controller ${controller.name}`);
      }

      this.controllerConversor(this.app, controller, conversorOptions);
    });
    this.didConvertRoutes = true;
  }

  async listen(port = 9090) {
    this.convertRoutes();
    await this.app.ready();

    if (this.opts.docs !== false) {
      this.app.swagger();
    }

    await this.app.listen({ port });

    if (this.opts.log === "all") {
      const origin = this.opts.origin ?? `http://localhost:${port}`;
      console.log(`\n[✓] ${this.name} running in ${origin}`);
    }
  }

  async run(port = 9090) {
    await this.listen(port);
  }

  async close() {
    await this.app.close();
  }

  static fastifyControllerConversor(
    app: FastifyTypedInstance,
    controller: AppController,
    opts: ControllerConvertOptions,
  ) {
    controller.convertRoutes(app, opts);
  }

  private registerDocumentation() {
    if (this.opts.docs === false) {
      return;
    }

    this.app.register(fastifySwagger, {
      ...this.opts.docs.swagger,
      transform: this.opts.docs.swagger.transform ?? jsonSchemaTransform,
    });

    this.app.register(ScalarApiReference, this.opts.docs.scalar);
  }

  private registerCors() {
    if (this.opts.cors === false) {
      return;
    }

    this.app.register(fastifyCors, this.opts.cors);
  }

  private registerDefaultErrorHandler() {
    this.app.setErrorHandler((err, request, reply) => {
      const isDev =
        process.env.NODE_ENV !== "production" &&
        process.env.NODE_ENV !== "staging";

      if (err instanceof ApplicationError) {
        const logPayload = {
          name: err.name,
          statusCode: err.statusCode,
          message: err.message,
          cause: err.cause,
          ...(err.details != null && { details: err.details }),
        };
        request.log.error(logPayload, "ApplicationError");
        // Garante que o erro apareça no terminal (request.log pode não estar visível)
        const causeStr =
          err.cause instanceof Error ? err.cause.message : String(err.cause ?? "");
        console.error("\n[ERROR]", err.name, err.statusCode, err.message);
        console.error("  cause:", causeStr);
        if (err.details != null) {
          console.error("  details:", JSON.stringify(err.details, null, 2));
        }
        console.error("");

        const errorBody = err.toJson();
        if (isDev && (err.statusCode === 502 || err.statusCode === 422)) {
          const causeDesc =
            err.cause instanceof Error ? err.cause.message : String(err.cause ?? "");
          (errorBody as Record<string, unknown>).cause = causeDesc;
          if (err.details != null) {
            (errorBody as Record<string, unknown>).details = err.details;
          }
        }

        return reply.status(err.statusCode).send({
          status: err.statusCode,
          error: errorBody,
        });
      }

      if (err instanceof Error) {
        request.log.error({ err, message: err.message }, "Unhandled Error");
        console.error("\n[ERROR] Unhandled Error:", err.message);
        console.error(err.stack ?? err);
        console.error("");
        const internalError = new InternalServerError({
          cause: err.message,
        });
        return reply.status(internalError.statusCode).send({
          status: internalError.statusCode,
          error: internalError.toJson(),
        });
      }

      request.log.error({ err }, "Unknown error");
      console.error("\n[ERROR] Unknown:", err);
      console.error("");
      return reply.send(err);
    });
  }

  private syncActiveModules() {
    setActiveModules(this.modulesStore);
  }

  private resolveOptions(opts?: ServerOptions): ResolvedServerOptions {
    const defaultOptions = Server.defaultOptions;
    const defaultDocs = Server.defaultDocs;

    if (!opts) {
      return defaultOptions;
    }

    if (opts.docs === false) {
      return {
        log: opts.log ?? defaultOptions.log,
        origin: opts.origin ?? defaultOptions.origin,
        cors: opts.cors === undefined ? defaultOptions.cors : opts.cors,
        docs: false,
      };
    }

    return {
      log: opts.log ?? defaultOptions.log,
      origin: opts.origin ?? defaultOptions.origin,
      cors: opts.cors === undefined ? defaultOptions.cors : opts.cors,
      docs:
        opts.docs === undefined
          ? defaultDocs
          : {
              swagger: {
                ...defaultDocs.swagger,
                ...opts.docs.swagger,
              },
              scalar: {
                ...defaultDocs.scalar,
                ...opts.docs.scalar,
              },
            },
    };
  }

  private static readonly defaultDocs: ServerDocsOptions = {
    swagger: {
      openapi: {
        info: {
          title: "Ankorar API",
          description: "API reference",
          version: "0.0.1",
        },
        servers: [{ url: "http://localhost:9090" }],
      },
    },
    scalar: {
      routePrefix: "/docs",
      configuration: {
        theme: "deepSpace",
        title: "Minha API Reference",
        hideClientButton: true,
        operationTitleSource: "path",
      },
    },
  };

  private static readonly defaultCors: FastifyCorsOptions = {
    origin: true,
    methods: ["POST", "GET", "OPTIONS", "PATCH", "DELETE", "PUT"],
    credentials: true,
  };

  private static readonly defaultOptions: ResolvedServerOptions = {
    log: "all",
    origin: undefined,
    docs: Server.defaultDocs,
    cors: Server.defaultCors,
  };
}
