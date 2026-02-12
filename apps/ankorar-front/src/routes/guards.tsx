import { Logo } from "@/components/assets/logo";
import { useUser } from "@/hooks/useUser";
import { Navigate, Outlet, useLocation } from "react-router";

function AuthLoadingScreen() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
        <Logo className="h-8 w-8" />
        <div>
          <p className="text-sm font-semibold">ANKORAR</p>
          <p className="text-xs text-zinc-400">Carregando sessão...</p>
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
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
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
