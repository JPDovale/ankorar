import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@/hooks/useUser";
import { getUserInitials } from "@/utils/getUserInitials";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";

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
            className="flex w-full min-w-0 items-center gap-1.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-zinc-100/80 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-1.5"
            aria-label={`Abrir ações do usuário ${userName}`}
          >
            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-zinc-200/80 text-[11px] font-semibold text-zinc-700">
              {initials}
            </span>
            <div className="min-w-0 group-data-[collapsed=true]:hidden">
              <p className="truncate text-[11px] font-semibold text-zinc-900">
                {userName}
              </p>
              <p className="truncate text-[10px] text-zinc-500">{userEmail}</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-36 p-1"
        >
          <Button
            variant="ghost"
            className="h-7 w-full justify-start gap-1.5 rounded-md px-1.5 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut && (
              <LoaderCircle className="size-3 shrink-0 animate-spin" />
            )}
            {!isLoggingOut && <LogOut className="size-3 shrink-0" />}
            Sair
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
