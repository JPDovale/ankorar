import type { SideBarLink } from "@/config/sideBar";
import { SideBarItem } from "./Item";

interface SideBarNavProps {
  links: SideBarLink[];
}

export function SideBarNav({ links }: SideBarNavProps) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 group-data-[collapsed=true]:px-2">
      {links.map((item) => (
        <SideBarItem key={item.to} item={item} />
      ))}
    </nav>
  );
}
