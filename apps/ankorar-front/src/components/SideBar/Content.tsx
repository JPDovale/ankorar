import { Suspense } from "react";
import { SideBarBrand } from "./Brand";
import { SideBarFooter } from "./Footer";
import { SideBarNav } from "./Nav";

interface SideBarContentProps {
  showExpandControlWhenCollapsed?: boolean;
}

function SideBarNavFallback() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1 px-1.5 py-2">
      <div className="h-8 animate-pulse rounded-md bg-zinc-100" />
      <div className="h-8 animate-pulse rounded-md bg-zinc-100" />
      <div className="h-8 animate-pulse rounded-md bg-zinc-100" />
    </div>
  );
}

export function SideBarContent({
  showExpandControlWhenCollapsed = false,
}: SideBarContentProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
      <SideBarBrand
        showExpandControlWhenCollapsed={showExpandControlWhenCollapsed}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        <Suspense fallback={<SideBarNavFallback />}>
          <SideBarNav />
        </Suspense>
      </div>
      <SideBarFooter />
    </div>
  );
}
