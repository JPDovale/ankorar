import { useUser } from "@/hooks/useUser";

interface CanProps {
  feature: string;
  children: React.ReactNode;
}

/**
 * Renderiza os filhos apenas se o usuário atual (membro da organização em contexto)
 * tiver a permissão (feature) informada.
 */
export function Can({ feature, children }: CanProps) {
  const { can } = useUser();

  if (!can(feature)) {
    return null;
  }

  return <>{children}</>;
}
