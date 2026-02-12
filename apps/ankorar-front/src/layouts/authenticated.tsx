import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { Outlet } from "react-router";

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-zinc-100/70">
      <div className="flex min-h-screen">
        <SideBar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
