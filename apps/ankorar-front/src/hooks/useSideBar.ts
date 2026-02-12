import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SideBarState {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

export const useSideBar = create<SideBarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggleCollapsed: () =>
        set((state) => ({
          collapsed: !state.collapsed,
        })),
    }),
    {
      name: "ankorar-front:sidebar",
    },
  ),
);
