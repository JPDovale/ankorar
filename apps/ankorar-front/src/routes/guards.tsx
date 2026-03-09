import { AnkorarLogoMark } from "@/components/AnkorarLogoMark";
import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet, useLocation } from "react-router";

function AuthLoadingScreen() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-ds-surface text-navy-900">
      <div className="flex items-center gap-3 rounded-xl border border-navy-200/50 bg-ds-surface-elevated px-5 py-4 shadow-sm">
        <AnkorarLogoMark className="size-5 shrink-0 text-amber-600" />
        <div>
          <p className="text-sm font-bold">Anko<span className="text-amber-600">rar</span></p>
          <p className="text-xs text-text-muted">Carregando sessão...</p>
        </div>
      </div>
    </main>
  );
}

export function ProtectedRoute() {
  const { user, isLoadingUser } = useUser();
  const location = useLocation();

  if (isLoadingUser) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, isLoadingUser } = useUser();

  if (isLoadingUser) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
