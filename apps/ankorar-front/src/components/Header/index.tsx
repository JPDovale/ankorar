import { Button } from "@/components/ui/button";
import { useSideBar } from "@/hooks/useSideBar";
import { useTheme } from "@/hooks/useTheme";
import { Moon, PanelLeftOpen, Sun } from "lucide-react";
import { OrganizationSwitcher } from "./components/OrganizationSwitcher";

export function Header() {
  const { collapsed, toggleCollapsed } = useSideBar();
  const { themeMode, toggleThemeMode } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-navy-200/40 bg-ds-surface-elevated/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-4">
        <div className="flex items-center gap-2">
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-text-muted hover:bg-navy-100/80 hover:text-navy-900"
              onClick={toggleCollapsed}
              aria-label="Expandir sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </Button>
          )}

          <OrganizationSwitcher />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-text-muted hover:bg-navy-100/80 hover:text-navy-900"
          onClick={toggleThemeMode}
          aria-label={
            themeMode === "dark"
              ? "Ativar tema claro"
              : "Ativar tema escuro"
          }
          title={
            themeMode === "dark"
              ? "Ativar tema claro"
              : "Ativar tema escuro"
          }
        >
          {themeMode === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
