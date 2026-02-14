import { Button } from "@/components/ui/button";
import { useSideBar } from "@/hooks/useSideBar";
import { cn } from "@/lib/utils";
import { Link2, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink } from "react-router";

interface SideBarBrandProps {
  showExpandControlWhenCollapsed?: boolean;
}

export function SideBarBrand({
  showExpandControlWhenCollapsed = false,
}: SideBarBrandProps) {
  const { collapsed, toggleCollapsed } = useSideBar();
  const showToggleControl = !collapsed || showExpandControlWhenCollapsed;

  return (
    <div
      className={cn(
        "flex h-16 items-center gap-2 border-b border-zinc-200/80 px-2.5",
        collapsed
          ? showExpandControlWhenCollapsed
            ? "justify-between"
            : "justify-center"
          : "justify-between",
      )}
    >
      <NavLink
        to="/home"
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-zinc-50",
          collapsed && "justify-center gap-0 px-0",
        )}
      >
        <span className="rounded-md border border-zinc-200 bg-zinc-100 p-1 text-zinc-700">
          <Link2 className="size-4" />
        </span>
        <div className="group-data-[collapsed=true]:hidden">
          <p className="text-sm font-semibold leading-none tracking-tight text-zinc-900">
            Ankorar
          </p>
        </div>
      </NavLink>

      {showToggleControl && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-3.5" />
          ) : (
            <PanelLeftClose className="size-3.5" />
          )}
        </Button>
      )}
    </div>
  );
}
