/**
 * Features padrão atribuídas ao criar um membro (ativação, convite aceito ou upsert).
 * Inclui:
 * - Sessão: create:session, read:session
 * - Mapas: criar/ler/editar/apagar (read:map, create:map, update:map, delete:map)
 * - Organização: editar nome, cancelar convite, remover membros (create:organization_invite só para owner)
 * - Planos e assinatura: read:plans, read:subscription, create:checkout, create:portal
 */
const defaultMemberFeatures = [
  "create:session",
  "read:session",
  "read:organization",
  "read:organization_members",
  "remove:member",
  "cancel:organization_invite",
  "update:organization",
  "read:plans",
  "read:map",
  "create:map",
  "update:map",
  "delete:map",
  "read:subscription",
  "create:checkout",
  "create:portal",
];

export { defaultMemberFeatures };
