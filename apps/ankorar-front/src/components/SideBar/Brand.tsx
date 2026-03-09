import { AnkorarLogoMark } from "@/components/AnkorarLogoMark";
import { Button } from "@/components/ui/button";
import { useSideBar } from "@/hooks/useSideBar";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NavLink } from "react-router";

interface SideBarBrandProps {
  showExpandControlWhenCollapsed?: boolean;
}

export function SideBarBrand({
  showExpandControlWhenCollapsed = false,
}: SideBarBrandProps) {
  const { collapsed, toggleCollapsed } = useSideBar();
  const showToggleControl = !collapsed || showExpandControlWhenCollapsed;
  const showBrandLink = !collapsed || !showExpandControlWhenCollapsed;

  return (
    <div
      className={cn(
        "flex h-16 items-center gap-2 border-b border-navy-200/40",
        collapsed ? "justify-center px-0" : "justify-between px-2.5",
      )}
    >
      {showBrandLink && (
        <NavLink
          to="/home"
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-amber-50/50",
            collapsed && "justify-center gap-0 px-0",
          )}
        >
          <AnkorarLogoMark className="size-5 shrink-0 text-amber-600" />
          <div className="group-data-[collapsed=true]:hidden">
            <p className="text-sm font-bold leading-none tracking-tight text-navy-900">
              Anko<span className="text-amber-600">rar</span>
            </p>
          </div>
        </NavLink>
      )}

      {showToggleControl && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 rounded-md text-text-muted hover:bg-navy-100/80 hover:text-navy-900 group-data-[collapsed=true]:mx-auto"
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
