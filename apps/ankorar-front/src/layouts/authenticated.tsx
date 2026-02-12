import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Sparkles } from "lucide-react";
import { Outlet } from "react-router";

export function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-zinc-100/70">
      <div className="flex min-h-screen">
        <SideBar />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Painel logado</p>
                  <h1 className="flex items-center gap-2 text-2xl font-semibold text-zinc-950">
                    <LayoutDashboard className="size-5" />
                    Workspace
                  </h1>
                </div>
                <Badge variant="outline" className="hidden sm:inline-flex">
                  <Sparkles className="mr-1 size-3" />
                  UI shadcn
                </Badge>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
