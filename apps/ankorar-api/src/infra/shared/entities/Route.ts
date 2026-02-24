import type {
  FastifyReply,
  FastifyRequest,
  preHandlerAsyncHookHandler,
} from "fastify";
import { FastifyTypedInstance } from "../../http/types/fastify";
import z from "zod";
import type { AppModules } from "./Modules";

type Method = "get" | "post" | "put" | "patch" | "delete";
export type RouteBodySchema = z.ZodTypeAny;
export type RouteResponseSchema = Partial<
  Record<number | `${number}` | "default", z.ZodTypeAny>
>;
export type RouteParamsSchema = z.ZodTypeAny;
export type RouteQuerystringSchema = z.ZodTypeAny;
type BodySchema = RouteBodySchema;
type ParamsSchema = RouteParamsSchema;
type QuerystringSchema = RouteQuerystringSchema;
type BodyFromSchema<TSchema> = TSchema extends BodySchema
  ? z.infer<TSchema>
  : unknown;
type ParamsFromSchema<TSchema> = TSchema extends ParamsSchema
  ? z.infer<TSchema>
  : unknown;
type QuerystringFromSchema<TSchema> = TSchema extends QuerystringSchema
  ? z.infer<TSchema>
  : unknown;
type ReplyFromSchema<TSchema> = TSchema extends RouteResponseSchema
  ? { [K in keyof TSchema]: z.infer<TSchema[K]> }
  : unknown;
type RouteGenericFromSchemas<
  TBodySchema,
  TResponseSchema,
  TParamsSchema,
  TQuerystringSchema = undefined,
> = {
  Body: BodyFromSchema<TBodySchema>;
  Reply: ReplyFromSchema<TResponseSchema>;
  Params: ParamsFromSchema<TParamsSchema>;
  Querystring: QuerystringFromSchema<TQuerystringSchema>;
};
type RouteExecutionContext = { modules: AppModules };
type PreHandler<
  TBodySchema,
  TResponseSchema,
  TParamsSchema,
  TQuerystringSchema = undefined,
> = {
  bivarianceHack(
    r: FastifyRequest<
      RouteGenericFromSchemas<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >
    >,
    t: FastifyReply<
      RouteGenericFromSchemas<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >
    >,
    context: RouteExecutionContext,
  ): Promise<void> | void;
}["bivarianceHack"];
type Handler<
  TBodySchema,
  TResponseSchema,
  TParamsSchema,
  TQuerystringSchema = undefined,
> = {
  bivarianceHack(
    r: FastifyRequest<
      RouteGenericFromSchemas<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >
    >,
    t: FastifyReply<
      RouteGenericFromSchemas<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >
    >,
    context: RouteExecutionContext,
  ):
    | Promise<void>
    | void
    | Promise<
        FastifyReply<
          RouteGenericFromSchemas<
            TBodySchema,
            TResponseSchema,
            TParamsSchema,
            TQuerystringSchema
          >
        >
      >
    | FastifyReply<
        RouteGenericFromSchemas<
          TBodySchema,
          TResponseSchema,
          TParamsSchema,
          TQuerystringSchema
        >
      >;
}["bivarianceHack"];

interface CreateRouteProps<
  TBodySchema extends BodySchema | undefined = undefined,
  TResponseSchema extends RouteResponseSchema | undefined = undefined,
  TParamsSchema extends ParamsSchema | undefined = undefined,
  TQuerystringSchema extends QuerystringSchema | undefined = undefined,
> {
  path: string;
  tags: string[];
  body?: TBodySchema;
  response?: TResponseSchema;
  params?: TParamsSchema;
  querystring?: TQuerystringSchema;
  preHandler?:
    | PreHandler<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >
    | PreHandler<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >[];
  method: Method;
  summary: string;
  description: string;
  bodyLimit?: number;
  handler: Handler<
    TBodySchema,
    TResponseSchema,
    TParamsSchema,
    TQuerystringSchema
  >;
}

export class Route<
  TBodySchema extends BodySchema | undefined = undefined,
  TResponseSchema extends RouteResponseSchema | undefined = undefined,
  TParamsSchema extends ParamsSchema | undefined = undefined,
  TQuerystringSchema extends QuerystringSchema | undefined = undefined,
> {
  path;
  tags;
  method;
  body?: TBodySchema;
  response?: TResponseSchema;
  params?: TParamsSchema;
  querystring?: TQuerystringSchema;
  preHandler?:
    | PreHandler<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >
    | PreHandler<
        TBodySchema,
        TResponseSchema,
        TParamsSchema,
        TQuerystringSchema
      >[];
  handler: Handler<
    TBodySchema,
    TResponseSchema,
    TParamsSchema,
    TQuerystringSchema
  >;
  summary;
  description;
  bodyLimit?;

  protected constructor({
    path,
    tags,
    method,
    handler,
    description,
    summary,
    body,
    response,
    params,
    querystring,
    preHandler,
    bodyLimit,
  }: CreateRouteProps<
    TBodySchema,
    TResponseSchema,
    TParamsSchema,
    TQuerystringSchema
  >) {
    this.path = path;
    this.tags = tags;
    this.method = method;
    this.handler = handler;
    this.summary = summary;
    this.body = body;
    this.response = response;
    this.params = params;
    this.querystring = querystring;
    this.preHandler = preHandler;
    this.description = description;
    this.bodyLimit = bodyLimit;
  }

  static create<
    TBodySchema extends BodySchema | undefined = undefined,
    TResponseSchema extends RouteResponseSchema | undefined = undefined,
    TParamsSchema extends ParamsSchema | undefined = undefined,
    TQuerystringSchema extends QuerystringSchema | undefined = undefined,
  >(
    props: CreateRouteProps<
      TBodySchema,
      TResponseSchema,
      TParamsSchema,
      TQuerystringSchema
    >,
  ) {
    return new Route<
      TBodySchema,
      TResponseSchema,
      TParamsSchema,
      TQuerystringSchema
    >(props);
  }

  static fastifyRouterConversor(
    app: FastifyTypedInstance,
    route: AnyRoute,
    opts: { log: "never" | "all"; modules: AppModules },
  ) {
    const wrapPreHandler = (
      preHandler: PreHandler<any, any, any>,
    ): preHandlerAsyncHookHandler =>
      async (request, reply) =>
        await preHandler(request as any, reply as any, {
          modules: opts.modules,
        });

    const bodyValidator = route.body === undefined ? {} : { body: route.body };
    const responseValidator =
      route.response === undefined ? {} : { response: route.response };
    const paramsValidator =
      route.params === undefined ? {} : { params: route.params };
    const querystringValidator =
      route.querystring === undefined
        ? {}
        : { querystring: route.querystring };
    const preHandler =
      route.preHandler === undefined
        ? {}
        : {
            preHandler: Array.isArray(route.preHandler)
              ? route.preHandler.map(
                  (preHandler) => wrapPreHandler(preHandler),
                )
              : wrapPreHandler(route.preHandler),
          };
    const bodyLimit =
      route.bodyLimit === undefined ? {} : { bodyLimit: route.bodyLimit };

    if (opts.log === "all") {
      console.log(
        `    [V] Register route ${route.method.toUpperCase()} ${route.path}`,
      );
    }

    app.register((app) => {
      app[route.method](
        route.path,
        {
          ...preHandler,
          ...bodyLimit,
          schema: {
            tags: route.tags,
            summary: route.summary,
            description: route.description,
            ...bodyValidator,
            ...responseValidator,
            ...paramsValidator,
            ...querystringValidator,
          },
        },
        (request, reply) =>
          route.handler(request as any, reply as any, {
            modules: opts.modules,
          }),
      );
    });
  }

  static canRequest(feature: string) {
    return (
      request: FastifyRequest,
      reply: FastifyReply,
      context: RouteExecutionContext,
    ) => {
      const { Controller } = context.modules.webserver;
      return Controller.canRequest(feature)(request, reply);
    };
  }
}

export type AnyRoute = Route<any, any, any, any>;
