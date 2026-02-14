import { Module } from "@/src/infra/shared/entities/Module";
import { Controller } from "./Controller";
import { Webserver } from "./Webserver";

interface WebserverModuleProps {
  name: string;
  Webserver: typeof Webserver;
  Controller: typeof Controller;
}

class WebserverModule extends Module<WebserverModuleProps> {
  static create(props: WebserverModuleProps) {
    return new WebserverModule(props, props.name);
  }

  get Webserver() {
    return this.props.Webserver;
  }

  get Controller() {
    return this.props.Controller;
  }
}

export const webserverModule = WebserverModule.create({
  name: "WebserverModule",
  Webserver,
  Controller,
});
