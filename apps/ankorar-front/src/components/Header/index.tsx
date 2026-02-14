import { Button } from "@/components/ui/button";
import { useSideBar } from "@/hooks/useSideBar";
import { PanelLeftOpen } from "lucide-react";
import { OrganizationSwitcher } from "./components/OrganizationSwitcher";

export function Header() {
  const { collapsed, toggleCollapsed } = useSideBar();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center px-4 sm:px-4">
        <div className="flex items-center gap-2">
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              onClick={toggleCollapsed}
              aria-label="Expandir sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </Button>
          )}

          <OrganizationSwitcher />
        </div>
      </div>
    </header>
  );
}
