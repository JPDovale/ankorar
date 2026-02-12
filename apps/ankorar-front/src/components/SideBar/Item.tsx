import type { SideBarLink } from "@/config/sideBar";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router";

interface SideBarItemProps {
  item: SideBarLink;
}

export function SideBarItem({ item }: SideBarItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      title={item.label}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
          "group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2",
          "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950",
          isActive &&
            "bg-zinc-950 text-zinc-50 hover:bg-zinc-950 hover:text-zinc-50",
        )
      }
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex flex-col group-data-[collapsed=true]:hidden">
        <span className="text-sm font-medium">{item.label}</span>
        <span className="text-xs opacity-80">{item.description}</span>
      </span>
    </NavLink>
  );
}
