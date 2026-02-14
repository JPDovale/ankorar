import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/hooks/useUser";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

function getUserInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (initials.length > 0) {
    return initials;
  }

  return "US";
}

export function SideBarFooter() {
  const { user, logout, isLoggingOut } = useUser();
  const userName = user?.name || "Usuário";
  const userEmail = user?.email || "sem-email";
  const initials = getUserInitials(userName);

  async function handleLogout() {
    const { success } = await logout();

    if (!success) {
      return;
    }

    toast.success("Sessão encerrada.");
  }

  return (
    <div className="border-t border-zinc-200/80 px-1.5 py-2.5">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="hidden w-full items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50/80 p-1.5 transition-colors hover:bg-zinc-100 group-data-[collapsed=true]:inline-flex"
            aria-label={`Abrir ações do usuário ${userName}`}
          >
            <span className="inline-flex size-7 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 text-[11px] font-semibold text-zinc-700">
              {initials}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start" sideOffset={8} className="w-36 p-1">
          <Button
            variant="ghost"
            className="h-7 w-full justify-start gap-1.5 rounded-md px-1.5 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <LoaderCircle className="size-3 shrink-0 animate-spin" />
            ) : (
              <LogOut className="size-3 shrink-0" />
            )}
            Sair
          </Button>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full min-w-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/80 p-2 text-left transition-colors hover:border-zinc-300 group-data-[collapsed=true]:hidden"
            aria-label={`Abrir ações do usuário ${userName}`}
          >
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-[11px] font-semibold text-zinc-700">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-zinc-900">
                {userName}
              </p>
              <p className="truncate text-[10px] text-zinc-500">{userEmail}</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent side="right" align="start" sideOffset={8} className="w-36 p-1">
          <Button
            variant="ghost"
            className="h-7 w-full justify-start gap-1.5 rounded-md px-1.5 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <LoaderCircle className="size-3 shrink-0 animate-spin" />
            ) : (
              <LogOut className="size-3 shrink-0" />
            )}
            Sair
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
