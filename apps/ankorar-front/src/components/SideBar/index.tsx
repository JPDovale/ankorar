import { sideBarLinks } from "@/config/sideBar";
import { useSideBar } from "@/hooks/useSideBar";
import { SideBarContent } from "./Content";

export function SideBar() {
  const { collapsed } = useSideBar();

  return (
    <aside
      data-collapsed={collapsed}
      className="group sticky top-0 flex h-dvh shrink-0 border-r border-zinc-200 bg-white transition-all duration-200 data-[collapsed=true]:w-14 data-[collapsed=false]:w-72"
    >
      <SideBarContent links={sideBarLinks} />
    </aside>
  );
}
