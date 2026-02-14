import { AuthenticatedLayout } from "@/layouts/authenticated";
import { DefaultLayout } from "@/layouts/default";
import { LibrariesPage } from "@/pages/libraries/page";
import { MapEditorPage } from "@/pages/map-editor";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/guards";
import { createBrowserRouter, RouterProvider } from "react-router";
import { HomePage } from "@/pages/home/page";

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
            path: "/maps/:map_id",
            Component: MapEditorPage,
          },
          {
            Component: AuthenticatedLayout,
            children: [
              {
                path: "/home",
                Component: HomePage,
              },
              {
                path: "/libraries",
                Component: LibrariesPage,
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
