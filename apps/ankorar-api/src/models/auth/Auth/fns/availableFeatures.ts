const availableFeatures = [
  // USERS
  "create:user",
  "create:user:other",
  "read:user",
  "read:user:other",

  // ACTIVATION
  "read:activation_token",

  // SESSIONS
  "create:session",
  "read:session",

  // ORGANIZATIONS
  "read:organization",
  "create:organization",
  "read:organization_members",
  "remove:member",
  "read:api_key",
  "create:api_key",
  "create:organization_invite",
  "cancel:organization_invite",
  "update:organization",

  // MAPS
  "read:map",
  "read:map:other",
  "create:map",
  "create:map:other",
  "update:map",
  "update:map:other",
  "delete:map",
  "delete:map:other",
  "like:map",
  "like:map:other",
  "unlike:map:other",

  // LIBRARIES
  "read:library",
  "create:library",
  "create:library:other",
  "connect:library",

  // SUBSCRIPTION
  "read:plans",
  "read:subscription",
  "create:checkout",
  "create:portal",

  // SAAS DASHBOARD
  "read:saas_dashboard",
];

/** Features que uma chave de API pode ter (contexto da organização: membros e mapas). */
const organizationApiKeyFeatures = [
  "read:organization_members",
  "create:user:other", // upsert de membro
  "remove:member",
  "read:map:other", // ler mapa de um membro específico
  "create:map:other", // criar mapa para membro
  "update:map:other", // atualizar mapa de membro
  "delete:map:other", // excluir mapa de membro
  "like:map:other", // curtir mapa de membro
  "unlike:map:other", // descurtir mapa de membro
  "read:library",
  "create:library",
  "create:library:other",
] as const;

export { availableFeatures, organizationApiKeyFeatures };
