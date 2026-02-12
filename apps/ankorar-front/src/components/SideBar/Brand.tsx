import { Button } from "@/components/ui/button";
import { useSideBar } from "@/hooks/useSideBar";
import { PanelLeftClose } from "lucide-react";
import { Logo } from "@/components/assets/logo";
import { NavLink } from "react-router";

export function SideBarBrand() {
  const { toggleCollapsed } = useSideBar();

  return (
    <div className="relative flex h-16 items-center justify-between px-3 group-data-[collapsed=true]:flex-col group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:gap-1 group-data-[collapsed=true]:px-2">
      <NavLink to="/home" className="flex min-w-0 shrink-0 items-center gap-3">
        <span className="rounded-lg bg-zinc-100 p-1.5 text-zinc-700 ring-1 ring-zinc-200 group-data-[collapsed=true]:p-1">
          <Logo className="size-5" />
        </span>
        <div className="group-data-[collapsed=true]:hidden">
          <p className="text-sm font-semibold leading-none">ANKORAR</p>
          <p className="text-xs text-zinc-500">Admin dashboard</p>
        </div>
      </NavLink>

      <Button
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-zinc-600 hover:text-zinc-950 group-data-[collapsed=true]:hidden"
        onClick={toggleCollapsed}
      >
        <PanelLeftClose className="size-4" />
      </Button>
    </div>
  );
}
