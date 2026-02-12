import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/hooks/useUser";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

function getInitials(name: string) {
  const chunks = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase() ?? "");

  return chunks.join("") || "AN";
}

export function UserInfo() {
  const { user, logout, isLoggingOut } = useUser();
  const userName = user?.name || "Usuário";
  const userEmail = user?.email || "sem-email";

  async function handleLogout() {
    const { success } = await logout();

    if (!success) {
      return;
    }

    toast.success("Sessão encerrada.");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-zinc-100"
        >
          <div className="hidden items-end text-right sm:flex sm:flex-col">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-zinc-500">{userEmail}</p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-zinc-50">
            {getInitials(userName)}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-44 p-1.5">
        <Button
          variant="ghost"
          className="h-8 w-full justify-start gap-2 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <LoaderCircle className="size-3.5 shrink-0 animate-spin" />
          ) : (
            <LogOut className="size-3.5 shrink-0" />
          )}
          Sair
        </Button>
      </PopoverContent>
    </Popover>
  );
}
