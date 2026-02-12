import { type ReactNode } from "react";
import { useRootKeyBindHandlers } from "../../hooks/mindMap/useRootKeyBindHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";
import { cn } from "../../lib/utils";

interface NodexProps {
  children?: ReactNode;
  className?: string;
}

export function Nodex({ children, className }: NodexProps) {
  useRootKeyBindHandlers();
  useMindMapHistoryDebounce();

  return (
    <section
      data-nodex
      className={cn(
        "flex h-full min-h-[480px] w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-sm font-sans",
        className,
      )}
    >
      {children}
    </section>
  );
}
