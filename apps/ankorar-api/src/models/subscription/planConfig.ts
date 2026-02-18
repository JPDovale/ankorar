import { defaultMemberFeatures } from "../auth/Auth/fns/defaultMemberFeatures";

/** Slug do plano; usado para mapear price_id (via env) → limites e features. */
export type PlanSlug =
  | "free"
  | "basics"
  | "premium"
  | "master"
  | "integration";

export type PlanLimits = {
  /** Máximo de mapas por organização (por membro/contexto). null = ilimitado. */
  max_maps: number | null;
  /** Máximo de organizações das quais o usuário pode participar (como membro). */
  max_organizations_join: number;
  /** Máximo de organizações que o usuário pode criar (ser creator). */
  max_organizations_create: number;
  /** Máximo de bibliotecas por organização. null = ilimitado. */
  max_libraries: number | null;
  /** Créditos de IA por mês (mapa com IA, aprofundar nó). Reset todo mês. */
  ai_credits_per_month: number;
};

const FREE_FEATURES: string[] = [
  ...defaultMemberFeatures,
  // Plano grátis: sem like:map, create:library, connect:library, api_key
];

const BASICS_FEATURES: string[] = [
  ...defaultMemberFeatures,
  "like:map",
  "read:library",
  "connect:library",
  "create:library",
];

const PREMIUM_FEATURES: string[] = [
  ...BASICS_FEATURES,
  "create:library",
];

const MASTER_FEATURES: string[] = [...PREMIUM_FEATURES];

const INTEGRATION_FEATURES: string[] = [
  ...defaultMemberFeatures,
  "like:map",
  "read:library",
  "create:library",
  "connect:library",
  "read:api_key",
  "create:api_key",
];

const PLAN_LIMITS: Record<PlanSlug, PlanLimits> = {
  free: {
    max_maps: 5,
    max_organizations_join: 2,
    max_organizations_create: 1,
    max_libraries: 0,
    ai_credits_per_month: 0,
  },
  basics: {
    max_maps: 50,
    max_organizations_join: 3,
    max_organizations_create: 1,
    max_libraries: 2,
    ai_credits_per_month: 5,
  },
  premium: {
    max_maps: null,
    max_organizations_join: 4,
    max_organizations_create: 2,
    max_libraries: null,
    ai_credits_per_month: 30,
  },
  master: {
    max_maps: null,
    max_organizations_join: 4,
    max_organizations_create: 3,
    max_libraries: null,
    ai_credits_per_month: 120,
  },
  integration: {
    max_maps: null,
    max_organizations_join: 999,
    max_organizations_create: 10,
    max_libraries: null,
    ai_credits_per_month: 250,
  },
};

const PLAN_FEATURES: Record<PlanSlug, string[]> = {
  free: FREE_FEATURES,
  basics: BASICS_FEATURES,
  premium: PREMIUM_FEATURES,
  master: MASTER_FEATURES,
  integration: INTEGRATION_FEATURES,
};

/** Mapa price_id → slug. Preenchido a partir de env (STRIPE_PRICE_ID_BASICS, etc.). */
function buildPriceIdToSlugMap(): Map<string, PlanSlug> {
  const map = new Map<string, PlanSlug>();
  const env = process.env as Record<string, string | undefined>;
  const pairs: Array<[string, PlanSlug]> = [
    [env.STRIPE_PRICE_ID_BASICS ?? "", "basics"],
    [env.STRIPE_PRICE_ID_PREMIUM ?? "", "premium"],
    [env.STRIPE_PRICE_ID_MASTER ?? "", "master"],
    [env.STRIPE_PRICE_ID_INTEGRATION ?? "", "integration"],
  ];
  for (const [priceId, slug] of pairs) {
    if (priceId) map.set(priceId, slug);
  }
  return map;
}

const priceIdToSlug = buildPriceIdToSlugMap();

function getSlugByPriceId(priceId: string | null): PlanSlug {
  if (!priceId) return "free";
  return priceIdToSlug.get(priceId) ?? "free";
}

export function getPlanLimits(stripePriceId: string | null): PlanLimits {
  return PLAN_LIMITS[getSlugByPriceId(stripePriceId)];
}

export function getPlanMemberFeatures(stripePriceId: string | null): string[] {
  return [...PLAN_FEATURES[getSlugByPriceId(stripePriceId)]];
}

export function getPlanSlug(stripePriceId: string | null): PlanSlug {
  return getSlugByPriceId(stripePriceId);
}
