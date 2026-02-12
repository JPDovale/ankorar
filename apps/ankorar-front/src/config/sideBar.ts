import { BrainCircuit, House, type LucideIcon } from "lucide-react";

export interface SideBarLink {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

export const sideBarLinks: SideBarLink[] = [
  {
    label: "Mapas",
    description: "Tela principal",
    to: "/home",
    icon: House,
  },
  {
    label: "Mind Map",
    description: "Editor visual",
    to: "/mind-map",
    icon: BrainCircuit,
  },
];
