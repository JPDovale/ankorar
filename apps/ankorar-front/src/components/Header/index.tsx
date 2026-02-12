import { Button } from "@/components/ui/button";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useSideBar } from "@/hooks/useSideBar";
import type { OrganizationOption } from "@/types/auth";
import { PanelLeftOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { UserInfo } from "./UserInfo";

function getOrganizationSlug(name: string, id: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toLowerCase();

  if (letters.length > 0) {
    return letters;
  }

  return id.slice(0, 2).toLowerCase();
}

export function Header() {
  const { organizations: organizationsPreview, isLoadingOrganizations } =
    useOrganizations();
  const { collapsed, toggleCollapsed } = useSideBar();

  const organizations = useMemo<OrganizationOption[]>(() => {
    return organizationsPreview.map((organization) => ({
      id: organization.id,
      name: organization.name,
      role: organization.role,
      slug: getOrganizationSlug(organization.name, organization.id),
    }));
  }, [organizationsPreview]);

  const currentOrganizationId =
    organizationsPreview.find((organization) => organization.is_current)?.id ?? "";

  const [selectedOrgId, setSelectedOrgId] = useState("");

  useEffect(() => {
    if (organizations.length === 0) {
      if (selectedOrgId !== "") {
        setSelectedOrgId("");
      }
      return;
    }

    const selectedExists = organizations.some(
      (organization) => organization.id === selectedOrgId,
    );

    if (selectedExists) {
      return;
    }

    if (currentOrganizationId) {
      setSelectedOrgId(currentOrganizationId);
      return;
    }

    setSelectedOrgId(organizations[0].id);
  }, [currentOrganizationId, organizations, selectedOrgId]);

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
          {isLoadingOrganizations ? (
            <Button variant="outline" className="h-10 gap-3 px-3" disabled>
              Carregando organizacoes...
            </Button>
          ) : organizations.length > 0 ? (
            <OrganizationSwitcher
              organizations={organizations}
              selectedOrgId={selectedOrgId}
              onSelectOrganization={setSelectedOrgId}
            />
          ) : (
            <Button variant="outline" className="h-10 gap-3 px-3" disabled>
              Sem organizacoes
            </Button>
          )}
        </div>
        <UserInfo />
      </div>
    </header>
  );
}
