import { Button } from "@/components/ui/button";
import { useSideBar } from "@/hooks/useSideBar";
import { useUser } from "@/hooks/useUser";
import type { OrganizationOption } from "@/types/auth";
import { PanelLeftOpen } from "lucide-react";
import { useMemo, useState } from "react";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { UserInfo } from "./UserInfo";

export function Header() {
  const { user } = useUser();
  const { collapsed, toggleCollapsed } = useSideBar();
  const userName = user?.name || "Usuário";

  const organizations = useMemo<OrganizationOption[]>(() => {
    const firstName = userName.split(" ")[0] || "Equipe";

    return [
      {
        id: "org-main",
        name: `${firstName} Workspace`,
        slug: "ws",
        role: "Owner",
      },
      {
        id: "org-ops",
        name: "Ankorar Operations",
        slug: "ops",
        role: "Admin",
      },
      {
        id: "org-labs",
        name: "Ankorar Labs",
        slug: "lb",
        role: "Member",
      },
    ];
  }, [userName]);

  const [selectedOrgId, setSelectedOrgId] = useState("org-main");

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-zinc-600 hover:text-zinc-950 -ml-4"
              onClick={toggleCollapsed}
            >
              <PanelLeftOpen className="size-4" />
            </Button>
          )}
          <OrganizationSwitcher
            organizations={organizations}
            selectedOrgId={selectedOrgId}
            onSelectOrganization={setSelectedOrgId}
          />
        </div>
        <UserInfo />
      </div>
    </header>
  );
}
