import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../lib/utils";

interface ZenCardProps {
  className?: string;
}

export function ZenCard({ className }: ZenCardProps = {}) {
  const { zenMode } = useMindMapState(
    useShallow((state) => ({ zenMode: state.zenMode })),
  );
  return (
    <div
      data-zen={zenMode}
      className={cn(
        "pointer-events-none absolute bottom-4 right-4 rounded-md border border-slate-200 bg-white/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm backdrop-blur transition-all duration-200 data-[zen=true]:opacity-100 data-[zen=true]:translate-y-0 opacity-0 translate-y-2$",
        className,
      )}
    >
      <div>Zen mode</div>
      <div className="text-[9px] font-medium normal-case tracking-normal text-slate-400">
        Alt+Z to exit
      </div>
    </div>
  );
}
