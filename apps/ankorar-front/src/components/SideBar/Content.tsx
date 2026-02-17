import type { SideBarLink } from "@/config/sideBar";
import { SideBarBrand } from "./Brand";
import { SideBarFooter } from "./Footer";
import { SideBarNav } from "./Nav";

interface SideBarContentProps {
  links: SideBarLink[];
  showExpandControlWhenCollapsed?: boolean;
}

export function SideBarContent({
  links,
  showExpandControlWhenCollapsed = false,
}: SideBarContentProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
      <SideBarBrand
        showExpandControlWhenCollapsed={showExpandControlWhenCollapsed}
      />
      <SideBarNav links={links} />
      <div className="min-h-0 flex-1" />
      <SideBarFooter />
    </div>
  );
}
