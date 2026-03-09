import { Can } from "@/components/auth/Can";
import { sideBarSections } from "@/config/sideBar";
import { useSuspenseLibraries } from "@/hooks/useLibraries";
import { useSuspenseMaps } from "@/hooks/useMaps";
import { cn } from "@/lib/utils";
import type { LibraryPreview } from "@/services/libraries/listLibrariesRequest";
import { ChevronDown, ChevronRight, FileText, Folder } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";

export function SideBarNav() {
  const { data: maps } = useSuspenseMaps();
  const { data: libraries } = useSuspenseLibraries();
  const [mapsOpen, setMapsOpen] = useState(true);
  const [librariesOpen, setLibrariesOpen] = useState(true);
  const [openLibraryIds, setOpenLibraryIds] = useState<Set<string>>(new Set());
  const location = useLocation();

  const isDashboardActive = location.pathname === "/dashboard";
  const isUsersSectionActive =
    location.pathname === "/users" || location.pathname.startsWith("/users/");
  const isMapsSectionActive =
    location.pathname === "/home" || location.pathname.startsWith("/maps/");
  const isLibrariesSectionActive = location.pathname === "/libraries";

  const toggleLibrary = (id: string) => {
    setOpenLibraryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const mapsList = maps ?? [];
  const librariesList = libraries ?? [];
  const DashboardIcon = sideBarSections[0].icon;
  const UsersIcon = sideBarSections[1].icon;

  return (
    <nav
      className="scrollbar flex w-full min-h-0 flex-1 flex-col overflow-y-auto px-1 py-2 group-data-[collapsed=true]:items-center group-data-[collapsed=true]:px-0"
      aria-label="Navegação principal"
    >
      <div className="w-full space-y-0.5 group-data-[collapsed=true]:w-8 group-data-[collapsed=true]:flex group-data-[collapsed=true]:flex-col group-data-[collapsed=true]:items-center">
        {/* Dashboard */}
        <Can feature="read:saas_dashboard">
          <NavLink
            to={sideBarSections[0].to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors ",
                "group-data-[collapsed=true]:mx-auto group-data-[collapsed=true]:size-8 group-data-[collapsed=true]:items-center group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:gap-0 group-data-[collapsed=true]:p-0",
                isActive || isDashboardActive
                  ? "bg-amber-400/15 text-amber-700"
                  : "text-text-secondary hover:bg-navy-100/80 hover:text-navy-900",
              )
            }
          >
            <DashboardIcon className="size-3.5 shrink-0" />
            <span className="truncate text-[13px] font-medium group-data-[collapsed=true]:hidden">
              {sideBarSections[0].label}
            </span>
          </NavLink>
        </Can>

        {/* Usuários */}
        <Can feature="read:user:other">
          <NavLink
            to={sideBarSections[1].to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors",
                "group-data-[collapsed=true]:mx-auto group-data-[collapsed=true]:size-8 group-data-[collapsed=true]:items-center group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:gap-0 group-data-[collapsed=true]:p-0",
                isActive || isUsersSectionActive
                  ? "bg-amber-400/15 text-amber-700"
                  : "text-text-secondary hover:bg-navy-100/80 hover:text-navy-900",
              )
            }
          >
            <UsersIcon className="size-3.5 shrink-0" />
            <span className="truncate text-[13px] font-medium group-data-[collapsed=true]:hidden">
              {sideBarSections[1].label}
            </span>
          </NavLink>
        </Can>

        {/* Mapas */}
        <Can feature="read:map">
          <SideBarTreeSection
            label={sideBarSections[2].label}
            to={sideBarSections[2].to}
            icon={sideBarSections[2].icon}
            isOpen={mapsOpen}
            onToggle={() => setMapsOpen((o) => !o)}
            isSectionActive={isMapsSectionActive}
          >
            {mapsList.length === 0 ? (
              <div className="py-1 pl-5 pr-2">
                <span className="text-[11px] text-text-muted">Nenhum mapa</span>
              </div>
            ) : (
              mapsList.map((map) => (
                <SideBarTreeItem
                  key={map.id}
                  to={`/maps/${map.id}`}
                  label={map.title}
                  icon={FileText}
                />
              ))
            )}
          </SideBarTreeSection>
        </Can>

        {/* Bibliotecas */}
        <Can feature="read:library">
          <SideBarTreeSection
            label={sideBarSections[3].label}
            to={sideBarSections[3].to}
            icon={sideBarSections[3].icon}
            isOpen={librariesOpen}
            onToggle={() => setLibrariesOpen((o) => !o)}
            isSectionActive={isLibrariesSectionActive}
          >
            {librariesList.length === 0 ? (
              <div className="py-1 pl-5 pr-2">
                <span className="text-[11px] text-text-muted">
                  Nenhuma biblioteca
                </span>
              </div>
            ) : (
              librariesList.map((lib) => (
                <SideBarTreeLibrary
                  key={lib.id}
                  library={lib}
                  isOpen={openLibraryIds.has(lib.id)}
                  onToggle={() => toggleLibrary(lib.id)}
                />
              ))
            )}
          </SideBarTreeSection>
        </Can>
      </div>
    </nav>
  );
}

interface SideBarTreeSectionProps {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  isSectionActive: boolean;
  children: React.ReactNode;
}

function SideBarTreeSection({
  label,
  to,
  icon: Icon,
  isOpen,
  onToggle,
  isSectionActive,
  children,
}: SideBarTreeSectionProps) {
  return (
    <div className="w-full group-data-[collapsed=true]:pl-1 rounded-md group-data-[collapsed=true]:w-8">
      <div className="flex items-center gap-0.5 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:gap-0">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className="flex size-5 shrink-0 items-center justify-center rounded text-text-muted hover:bg-navy-100/80 hover:text-navy-700 group-data-[collapsed=true]:hidden"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </button>
        <NavLink
          to={to}
          className={({ isActive }) =>
            cn(
              "flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors",
              "group-data-[collapsed=true]:mx-auto group-data-[collapsed=true]:size-8 group-data-[collapsed=true]:flex-none group-data-[collapsed=true]:items-center group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:gap-0 group-data-[collapsed=true]:p-0",
              isActive || isSectionActive
                ? "bg-amber-400/15 text-amber-700"
                : "text-text-secondary hover:bg-navy-100/80 hover:text-navy-900",
            )
          }
        >
          <Icon className="size-3.5 shrink-0" />
          <span className="truncate text-[13px] font-medium group-data-[collapsed=true]:hidden">
            {label}
          </span>
        </NavLink>
      </div>
      {isOpen && (
        <div className="ml-1 space-y-0.5 border-l border-navy-200/50 pl-2 group-data-[collapsed=true]:hidden">
          {children}
        </div>
      )}
    </div>
  );
}

interface SideBarTreeLibraryProps {
  library: LibraryPreview;
  isOpen: boolean;
  onToggle: () => void;
}

function SideBarTreeLibrary({
  library,
  isOpen,
  onToggle,
}: SideBarTreeLibraryProps) {
  const linkedMaps = library.maps ?? [];

  return (
    <div className="rounded-md group-data-[collapsed=true]:hidden">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className="flex size-5 shrink-0 items-center justify-center rounded text-text-muted hover:bg-navy-100/80 hover:text-navy-700"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
        </button>
        <NavLink
          to="/libraries"
          className={({ isActive }) =>
            cn(
              "flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 transition-colors",
              isActive
                ? "bg-amber-400/12 text-amber-700"
                : "text-text-secondary hover:bg-navy-100/80 hover:text-navy-900",
            )
          }
        >
          <Folder className="size-3.5 shrink-0" />
          <span className="truncate text-[12px] font-medium">
            {library.name}
          </span>
        </NavLink>
      </div>
      {isOpen && linkedMaps.length > 0 && (
        <div className="ml-1 space-y-0.5 border-l border-navy-200/50 pl-2">
          {linkedMaps.map((map) => (
            <SideBarTreeItem
              key={map.id}
              to={`/maps/${map.id}`}
              label={map.title}
              icon={FileText}
            />
          ))}
        </div>
      )}
      {isOpen && linkedMaps.length === 0 && (
        <div className="py-1 pl-5 pr-2">
          <span className="text-[11px] text-text-muted">
            Nenhum mapa vinculado
          </span>
        </div>
      )}
    </div>
  );
}

interface SideBarTreeItemProps {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function SideBarTreeItem({ to, label, icon: Icon }: SideBarTreeItemProps) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        cn(
          "group/item flex items-center gap-2 rounded-md px-1.5 py-1 transition-colors",
          "group-data-[collapsed=true]:hidden",
          isActive
            ? "bg-amber-400/12 text-amber-700"
            : "text-text-secondary hover:bg-navy-100/80 hover:text-navy-900",
        )
      }
    >
      <Icon className="size-3 shrink-0 text-text-muted group-hover/item:text-navy-700" />
      <span className="truncate text-[12px] font-medium">{label}</span>
    </NavLink>
  );
}
