import { type ReactNode } from "react";
import { useRootKeyBindHandlers } from "../../hooks/mindMap/useRootKeyBindHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";

interface NodexProps {
  children?: ReactNode;
}

export function Nodex({ children }: NodexProps) {
  useRootKeyBindHandlers();
  useMindMapHistoryDebounce();

  return (
    <section
      data-nodex
      className="flex h-full min-h-[480px] w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm font-sans"
    >
      {children}
    </section>
  );
}
