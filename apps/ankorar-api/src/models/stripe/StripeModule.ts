import Stripe from "stripe";
import { Module } from "@/src/infra/shared/entities/Module";
import {
  createModuleProxy,
  registerModuleClass,
} from "@/src/infra/shared/entities/Modules";
import { StripeService } from "./Stripe";

function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(secretKey);
}

interface StripeModuleProps {
  name: string;
  Stripe: typeof StripeService;
  getClient: () => Stripe;
}

export class StripeModule extends Module<StripeModuleProps> {
  static readonly moduleKey = "stripe";

  static create() {
    return new StripeModule(
      {
        name: "stripe",
        Stripe: StripeService,
        getClient: getStripeClient,
      },
      "stripe",
    );
  }

  get Stripe() {
    return this.props.Stripe;
  }

  get client() {
    return this.props.getClient();
  }
}

registerModuleClass(StripeModule);

declare module "@/src/infra/shared/entities/Modules" {
  interface AppModules {
    stripe: StripeModule;
  }
}

export const stripeModule = createModuleProxy("stripe");
