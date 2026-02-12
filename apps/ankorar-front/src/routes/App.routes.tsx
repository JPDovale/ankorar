import { AuthenticatedLayout } from "@/layouts/authenticated";
import { DefaultLayout } from "@/layouts/default";
import { HomePage } from "@/pages/home";
import { MindMapPage } from "@/pages/mind-map";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/guards";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      {
        Component: PublicOnlyRoute,
        children: [
          {
            index: true,
            Component: LoginPage,
          },
          {
            path: "/register",
            Component: RegisterPage,
          },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            Component: AuthenticatedLayout,
            children: [
              {
                path: "/home",
                Component: HomePage,
              },
              {
                path: "/mind-map",
                Component: MindMapPage,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
