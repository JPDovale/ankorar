import { Module } from "@/src/infra/shared/entities/Module";
import { ApiKeys } from "./ApiKeys";
import { Crypto } from "./Crypto";

interface CryptoModuleProps {
  name: string;
  ApiKeys: typeof ApiKeys;
  Crypto: typeof Crypto;
}

class CryptoModule extends Module<CryptoModuleProps> {
  static create(props: CryptoModuleProps) {
    return new CryptoModule(props, props.name);
  }

  get Crypto() {
    return this.props.Crypto;
  }

  get ApiKeys() {
    return this.props.ApiKeys;
  }
}

export const cryptoModule = CryptoModule.create({
  name: "CryptoModule",
  ApiKeys,
  Crypto,
});
