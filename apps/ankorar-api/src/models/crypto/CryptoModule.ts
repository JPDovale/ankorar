import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { ApiKeys } from "./ApiKeys";
import { Crypto } from "./Crypto";

interface CryptoModuleProps {
  name: string;
  ApiKeys: typeof ApiKeys;
  Crypto: typeof Crypto;
}

export class CryptoModule extends Module<CryptoModuleProps> {
  static readonly moduleKey = "crypto";

  static create() {
    return new CryptoModule(
      {
        name: "crypto",
        ApiKeys,
        Crypto,
      },
      "crypto",
    );
  }

  get Crypto() {
    return this.props.Crypto;
  }

  get ApiKeys() {
    return this.props.ApiKeys;
  }
}

registerModuleClass(CryptoModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    crypto: CryptoModule;
  }
}

export const cryptoModule = createModuleProxy("crypto");
