import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";

export function SideBarFooter() {
  const { user } = useUser();
  const userName = user?.name || "Usuário";
  const userEmail = user?.email || "sem-email";

  return (
    <div className="space-y-1 px-4 py-4 group-data-[collapsed=true]:px-2">
      <p className="text-sm font-medium group-data-[collapsed=true]:hidden">
        {userName}
      </p>
      <p className="truncate text-xs text-zinc-500 group-data-[collapsed=true]:hidden">
        {userEmail}
      </p>
      <Badge
        variant="secondary"
        className="mt-2 group-data-[collapsed=true]:hidden"
      >
        Sessao ativa
      </Badge>
      <div className="mx-auto hidden size-2 rounded-full bg-emerald-500 group-data-[collapsed=true]:block" />
    </div>
  );
}
