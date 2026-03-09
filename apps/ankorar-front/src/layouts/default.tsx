import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

export function DefaultLayout() {
  return (
    <div className="min-h-screen bg-ds-surface text-text-primary" style={{ fontFamily: "var(--font-syne-family)" }}>
      <Outlet />
      <Toaster />
    </div>
  );
}
