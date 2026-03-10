import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router";

export function AuthenticatedLayout() {
  return (
    <div
      className="h-dvh overflow-hidden bg-ds-surface p-2"
      style={{ fontFamily: "var(--font-syne-family)" }}
    >
      <div className="flex h-full gap-2">
        <SideBar />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-ds-surface-elevated shadow-[0_1px_2px_rgba(13,27,42,0.06)] border border-navy-200/30">
          <Header />

          <main className="scrollbar min-h-0 flex-1 overflow-y-auto bg-ds-surface/40 p-4 sm:p-6 lg:p-7">
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
