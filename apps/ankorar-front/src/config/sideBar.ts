import { LibraryBig, Map, type LucideIcon } from "lucide-react";

export interface SideBarSection {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const sideBarSections: SideBarSection[] = [
  { label: "Mapas", to: "/home", icon: Map },
  { label: "Bibliotecas", to: "/libraries", icon: LibraryBig },
];
