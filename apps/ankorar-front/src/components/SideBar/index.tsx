import { useSideBar } from "@/hooks/useSideBar";
import { SideBarContent } from "./Content";

interface SideBarProps {
  showExpandControlWhenCollapsed?: boolean;
}

export function SideBar({
  showExpandControlWhenCollapsed = false,
}: SideBarProps) {
  const { collapsed } = useSideBar();

  return (
    <aside
      data-collapsed={collapsed}
      className="group sticky top-2 h-[calc(100dvh-1rem)] shrink-0 transition-all duration-200 data-[collapsed=true]:w-14 data-[collapsed=false]:w-60"
    >
      <SideBarContent
        showExpandControlWhenCollapsed={showExpandControlWhenCollapsed}
      />
    </aside>
  );
}
