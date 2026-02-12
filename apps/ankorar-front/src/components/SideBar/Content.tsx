import type { SideBarLink } from "@/config/sideBar";
import { Separator } from "@/components/ui/separator";
import { SideBarBrand } from "./Brand";
import { SideBarFooter } from "./Footer";
import { SideBarNav } from "./Nav";

interface SideBarContentProps {
  links: SideBarLink[];
}

export function SideBarContent({ links }: SideBarContentProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-white">
      <SideBarBrand />
      <Separator />
      <SideBarNav links={links} />
      <Separator />
      <SideBarFooter />
    </div>
  );
}
