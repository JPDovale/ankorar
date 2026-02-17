import OpenAI from "openai";
import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { OpenAiService } from "./OpenAi";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
}

interface OpenAiModuleProps {
  name: string;
  OpenAi: typeof OpenAiService;
  getClient: () => OpenAI;
}

export class OpenAiModule extends Module<OpenAiModuleProps> {
  static readonly moduleKey = "openai";

  static create() {
    return new OpenAiModule(
      {
        name: "openai",
        OpenAi: OpenAiService,
        getClient: getOpenAIClient,
      },
      "openai",
    );
  }

  get OpenAi() {
    return this.props.OpenAi;
  }

  get client() {
    return this.props.getClient();
  }
}

registerModuleClass(OpenAiModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    openai: OpenAiModule;
  }
}

export const openAiModule = createModuleProxy("openai");
