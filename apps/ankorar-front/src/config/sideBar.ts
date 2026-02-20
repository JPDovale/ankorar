import {
  LayoutDashboard,
  LibraryBig,
  Map,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface SideBarSection {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const sideBarSections: SideBarSection[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Usuários", to: "/users", icon: Users },
  { label: "Mapas", to: "/home", icon: Map },
  { label: "Bibliotecas", to: "/libraries", icon: LibraryBig },
];
