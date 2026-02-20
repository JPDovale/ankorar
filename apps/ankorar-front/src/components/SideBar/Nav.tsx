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
      className="scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-1.5 py-2"
      aria-label="Navegação principal"
    >
      <div className="space-y-0.5">
        {/* Dashboard */}
        <Can feature="read:saas_dashboard">
          <div className="rounded-md">
            <NavLink
              to={sideBarSections[0].to}
              className={({ isActive }) =>
                cn(
                  "group/section flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors",
                  "group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-1",
                  isActive || isDashboardActive
                    ? "bg-violet-500/12 text-violet-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                )
              }
            >
              <DashboardIcon className="size-3.5 shrink-0" />
              <span className="truncate text-[13px] font-medium group-data-[collapsed=true]:hidden">
                {sideBarSections[0].label}
              </span>
            </NavLink>
          </div>
        </Can>

        {/* Usuários */}
        <Can feature="read:user:other">
          <div className="rounded-md">
            <NavLink
              to={sideBarSections[1].to}
              className={({ isActive }) =>
                cn(
                  "group/section flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors",
                  "group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-1",
                  isActive || isUsersSectionActive
                    ? "bg-violet-500/12 text-violet-700"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                )
              }
            >
              <UsersIcon className="size-3.5 shrink-0" />
              <span className="truncate text-[13px] font-medium group-data-[collapsed=true]:hidden">
                {sideBarSections[1].label}
              </span>
            </NavLink>
          </div>
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
                <span className="text-[11px] text-zinc-400">Nenhum mapa</span>
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
                <span className="text-[11px] text-zinc-400">
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
    <div className="rounded-md">
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
          className="flex size-5 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 group-data-[collapsed=true]:hidden"
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
              "group/section flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors",
              "group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-1",
              isActive || isSectionActive
                ? "bg-violet-500/12 text-violet-700"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
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
        <div className="ml-1 space-y-0.5 border-l border-zinc-200/80 pl-2 group-data-[collapsed=true]:hidden">
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
          className="flex size-5 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
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
                ? "bg-violet-500/10 text-violet-700"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
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
        <div className="ml-1 space-y-0.5 border-l border-zinc-200/80 pl-2">
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
          <span className="text-[11px] text-zinc-400">
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
            ? "bg-violet-500/10 text-violet-700"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
        )
      }
    >
      <Icon className="size-3 shrink-0 text-zinc-400 group-hover/item:text-zinc-600" />
      <span className="truncate text-[12px] font-medium">{label}</span>
    </NavLink>
  );
}
