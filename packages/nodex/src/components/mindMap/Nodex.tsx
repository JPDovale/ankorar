import { type ReactNode, useEffect } from "react";
import { useRootKeyBindHandlers } from "../../hooks/mindMap/useRootKeyBindHandlers";
import { useMindMapHistoryDebounce } from "../../hooks/mindMap/useMindMapHistoryDebounce";
import { cn } from "../../lib/utils";
import { useMindMapState } from "../../state/mindMap";

interface NodexProps {
  children?: ReactNode;
  className?: string;
  readOnly?: boolean;
}

export function Nodex({ children, className, readOnly = false }: NodexProps) {
  const setReadOnly = useMindMapState((state) => state.setReadOnly);

  useRootKeyBindHandlers();
  useMindMapHistoryDebounce();

  useEffect(() => {
    setReadOnly(readOnly);

    return () => {
      setReadOnly(false);
    };
  }, [readOnly, setReadOnly]);

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
