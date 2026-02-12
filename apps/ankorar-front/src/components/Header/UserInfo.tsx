import { useUser } from "@/hooks/useUser";

function getInitials(name: string) {
  const chunks = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase() ?? "");

  return chunks.join("") || "AN";
}

export function UserInfo() {
  const { user } = useUser();
  const userName = user?.name || "Usuário";
  const userEmail = user?.email || "sem-email";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-end text-right sm:flex sm:flex-col">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs text-zinc-500">{userEmail}</p>
      </div>
      <div className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-50">
        {getInitials(userName)}
      </div>
    </div>
  );
}
