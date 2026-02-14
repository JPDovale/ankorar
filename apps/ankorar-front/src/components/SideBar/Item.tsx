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
          "group/item flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-all",
          "group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-0",
          isActive
            ? "bg-zinc-900 text-zinc-50 shadow-sm"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className="size-3.5 shrink-0" />
          <span
            className={cn(
              "truncate text-[13px] font-medium leading-none group-data-[collapsed=true]:hidden",
              isActive ? "text-zinc-50" : "text-zinc-700",
            )}
          >
            {item.label}
          </span>
        </>
      )}
    </NavLink>
  );
}
