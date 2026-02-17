import { AuthenticatedLayout } from "@/layouts/authenticated";
import { DefaultLayout } from "@/layouts/default";
import { LibrariesPage } from "@/pages/libraries/page";
import { MapEditorPage } from "@/pages/map-editor/page";
import { LandingPage } from "@/pages/landing/page";
import { LoginPage } from "@/pages/login";
import { OrganizationSettingsPage } from "@/pages/organization-settings/page";
import { PricingPage } from "@/pages/pricing/page";
import { RegisterPage } from "@/pages/register";
import { SubscriptionPage } from "@/pages/subscription/page";
import { UserSettingsPage } from "@/pages/user-settings/page";
import { ProtectedRoute, PublicOnlyRoute } from "@/routes/guards";
import { createBrowserRouter, RouterProvider } from "react-router";
import { HomePage } from "@/pages/home/page";

const router = createBrowserRouter([
  {
    path: "/",
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        Component: PublicOnlyRoute,
        children: [
          {
            path: "/login",
            Component: LoginPage,
          },
          {
            path: "/register",
            Component: RegisterPage,
          },
        ],
      },
      {
        path: "/pricing",
        Component: PricingPage,
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
              {
                path: "/organizations/settings",
                Component: OrganizationSettingsPage,
              },
              {
                path: "/subscription",
                Component: SubscriptionPage,
              },
              {
                path: "/settings",
                Component: UserSettingsPage,
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
