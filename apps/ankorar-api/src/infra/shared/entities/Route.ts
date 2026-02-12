import type {
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  preHandlerAsyncHookHandler,
  preHandlerHookHandler,
} from "fastify";
import { FastifyTypedInstance } from "../../http/types/fastify";
import z from "zod";
import { webserverModule } from "@/src/models/webserver/WebserverModule";

type Method = "get" | "post" | "put" | "patch" | "delete";
export type RouteBodySchema = z.ZodTypeAny;
export type RouteResponseSchema = Partial<
  Record<number | `${number}` | "default", z.ZodTypeAny>
>;
export type RouteParamsSchema = z.ZodTypeAny;
type BodySchema = RouteBodySchema;
type ParamsSchema = RouteParamsSchema;
type BodyFromSchema<TSchema> = TSchema extends BodySchema
  ? z.infer<TSchema>
  : unknown;
type ParamsFromSchema<TSchema> = TSchema extends ParamsSchema
  ? z.infer<TSchema>
  : unknown;
type ReplyFromSchema<TSchema> = TSchema extends RouteResponseSchema
  ? { [K in keyof TSchema]: z.infer<TSchema[K]> }
  : unknown;
type RouteGenericFromSchemas<TBodySchema, TResponseSchema, TParamsSchema> = {
  Body: BodyFromSchema<TBodySchema>;
  Reply: ReplyFromSchema<TResponseSchema>;
  Params: ParamsFromSchema<TParamsSchema>;
};
type PreHandler<TBodySchema, TResponseSchema, TParamsSchema> =
  | preHandlerHookHandler<
      RawServerDefault,
      RawRequestDefaultExpression<RawServerDefault>,
      RawReplyDefaultExpression<RawServerDefault>,
      RouteGenericFromSchemas<TBodySchema, TResponseSchema, TParamsSchema>
    >
  | preHandlerAsyncHookHandler<
      RawServerDefault,
      RawRequestDefaultExpression<RawServerDefault>,
      RawReplyDefaultExpression<RawServerDefault>,
      RouteGenericFromSchemas<TBodySchema, TResponseSchema, TParamsSchema>
    >;
type Handler<TBodySchema, TResponseSchema, TParamsSchema> = {
  bivarianceHack(
    r: FastifyRequest<
      RouteGenericFromSchemas<TBodySchema, TResponseSchema, TParamsSchema>
    >,
    t: FastifyReply<
      RouteGenericFromSchemas<TBodySchema, TResponseSchema, TParamsSchema>
    >,
  ):
    | Promise<void>
    | void
    | Promise<
        FastifyReply<
          RouteGenericFromSchemas<TBodySchema, TResponseSchema, TParamsSchema>
        >
      >
    | FastifyReply<
        RouteGenericFromSchemas<TBodySchema, TResponseSchema, TParamsSchema>
      >;
}["bivarianceHack"];

interface CreateRouteProps<
  TBodySchema extends BodySchema | undefined = undefined,
  TResponseSchema extends RouteResponseSchema | undefined = undefined,
  TParamsSchema extends ParamsSchema | undefined = undefined,
> {
  path: string;
  tags: string[];
  body?: TBodySchema;
  response?: TResponseSchema;
  params?: TParamsSchema;
  preHandler?:
    | PreHandler<TBodySchema, TResponseSchema, TParamsSchema>
    | PreHandler<TBodySchema, TResponseSchema, TParamsSchema>[];
  method: Method;
  summary: string;
  description: string;
  bodyLimit?: number;
  handler: Handler<TBodySchema, TResponseSchema, TParamsSchema>;
}

export class Route<
  TBodySchema extends BodySchema | undefined = undefined,
  TResponseSchema extends RouteResponseSchema | undefined = undefined,
  TParamsSchema extends ParamsSchema | undefined = undefined,
> {
  path;
  tags;
  method;
  body?: TBodySchema;
  response?: TResponseSchema;
  params?: TParamsSchema;
  preHandler?:
    | PreHandler<TBodySchema, TResponseSchema, TParamsSchema>
    | PreHandler<TBodySchema, TResponseSchema, TParamsSchema>[];
  handler: Handler<TBodySchema, TResponseSchema, TParamsSchema>;
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
    preHandler,
    bodyLimit,
  }: CreateRouteProps<TBodySchema, TResponseSchema, TParamsSchema>) {
    this.path = path;
    this.tags = tags;
    this.method = method;
    this.handler = handler;
    this.summary = summary;
    this.body = body;
    this.response = response;
    this.params = params;
    this.preHandler = preHandler;
    this.description = description;
    this.bodyLimit = bodyLimit;
  }

  static create<
    TBodySchema extends BodySchema | undefined = undefined,
    TResponseSchema extends RouteResponseSchema | undefined = undefined,
    TParamsSchema extends ParamsSchema | undefined = undefined,
  >(props: CreateRouteProps<TBodySchema, TResponseSchema, TParamsSchema>) {
    return new Route<TBodySchema, TResponseSchema, TParamsSchema>(props);
  }

  static fastifyRouterConversor(
    app: FastifyTypedInstance,
    route: AnyRoute,
    opts: { log: "never" | "all" },
  ) {
    const bodyValidator = route.body === undefined ? {} : { body: route.body };
    const responseValidator =
      route.response === undefined ? {} : { response: route.response };
    const paramsValidator =
      route.params === undefined ? {} : { params: route.params };
    const preHandler =
      route.preHandler === undefined ? {} : { preHandler: route.preHandler };
    const bodyLimit =
      route.bodyLimit === undefined ? {} : { bodyLimit: route.bodyLimit };

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
          },
        },
        route.handler,
      );

      if (opts.log === "all") {
        console.log(
          `[V] Register route ${route.method.toUpperCase()} ${route.path}`,
        );
      }
    });
  }

  static canRequest(feature: string) {
    const { Controller: controller } = webserverModule;
    return controller.canRequest(feature);
  }
}

export type AnyRoute = Route<any, any, any>;
