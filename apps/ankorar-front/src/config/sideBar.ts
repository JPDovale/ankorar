import { House, LibraryBig, type LucideIcon } from "lucide-react";

export interface SideBarLink {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const sideBarLinks: SideBarLink[] = [
  {
    label: "Mapas",
    to: "/home",
    icon: House,
  },
  {
    label: "Bibliotecas",
    to: "/libraries",
    icon: LibraryBig,
  },
];
