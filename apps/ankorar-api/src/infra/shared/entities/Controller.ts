import { FastifyTypedInstance } from "../../http/types/fastify";
import type { AnyRoute } from "./Route";

interface CreateModelProps {
  name: string;
  routeConversor: (
    app: FastifyTypedInstance,
    route: AnyRoute,
    opts: { log: "all" | "never" },
  ) => void;
}

export class Controller {
  name: string;
  routes: AnyRoute[] = [];
  routeConversor: (
    app: FastifyTypedInstance,
    route: AnyRoute,
    opts: { log: "never" | "all" },
  ) => void;

  protected constructor({ name, routeConversor }: CreateModelProps) {
    this.name = name;
    this.routeConversor = routeConversor;
  }

  static create(props: CreateModelProps) {
    return new Controller(props);
  }

  appendRoute(route: AnyRoute) {
    this.routes.push(route);
  }

  convertRoutes(
    app: FastifyTypedInstance,
    opts: { log: "never" | "all" } = { log: "all" },
  ) {
    this.routes.forEach((route) => this.routeConversor(app, route, opts));
  }
}
