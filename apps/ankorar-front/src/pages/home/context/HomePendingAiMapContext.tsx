import { createContext, useCallback, useState, type ReactNode } from "react";

export type PendingAiMapLoading = {
  status: "loading";
  title: string;
};

export type PendingAiMapFinished = {
  status: "finished";
  mapId: string;
  title: string;
};

export type PendingAiMap = PendingAiMapLoading | PendingAiMapFinished;

type HomePendingAiMapContextValue = {
  pending: PendingAiMap | null;
  setPending: (value: PendingAiMap | null) => void;
};

export const HomePendingAiMapContext =
  createContext<HomePendingAiMapContextValue | null>(null);

export function HomePendingAiMapProvider({ children }: { children: ReactNode }) {
  const [pending, setPendingState] = useState<PendingAiMap | null>(null);

  const setPending = useCallback((value: PendingAiMap | null) => {
    setPendingState(value);
  }, []);

  return (
    <HomePendingAiMapContext.Provider value={{ pending, setPending }}>
      {children}
    </HomePendingAiMapContext.Provider>
  );
}
