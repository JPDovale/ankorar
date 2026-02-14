import type { SideBarLink } from "@/config/sideBar";
import { SideBarItem } from "./Item";

interface SideBarNavProps {
  links: SideBarLink[];
}

export function SideBarNav({ links }: SideBarNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-1.5 py-2">
      <div className="space-y-1">
        {links.map((item) => (
          <SideBarItem key={item.to} item={item} />
        ))}
      </div>
    </nav>
  );
}
