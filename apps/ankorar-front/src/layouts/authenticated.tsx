import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router";

export function AuthenticatedLayout() {
  return (
    <div className="h-dvh overflow-hidden bg-zinc-100/80 p-2">
      <div className="flex h-full gap-2">
        <SideBar />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]">
          <Header />

          <main className="scrollbar min-h-0 flex-1 overflow-y-auto bg-zinc-50/50 p-4 sm:p-6 lg:p-7">
            <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
