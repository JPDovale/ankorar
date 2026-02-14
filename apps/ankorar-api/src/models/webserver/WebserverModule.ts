import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { Controller } from "./Controller";
import { Webserver } from "./Webserver";

interface WebserverModuleProps {
  name: string;
  Webserver: typeof Webserver;
  Controller: typeof Controller;
}

export class WebserverModule extends Module<WebserverModuleProps> {
  static readonly moduleKey = "webserver";

  static create() {
    return new WebserverModule(
      {
        name: "webserver",
        Webserver,
        Controller,
      },
      "webserver",
    );
  }

  get Webserver() {
    return this.props.Webserver;
  }

  get Controller() {
    return this.props.Controller;
  }
}

registerModuleClass(WebserverModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    webserver: WebserverModule;
  }
}

export const webserverModule = createModuleProxy("webserver");
