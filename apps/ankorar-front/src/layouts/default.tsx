import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

export function DefaultLayout() {
  return (
    <div>
      <Outlet />
      <Toaster />
    </div>
  );
}
