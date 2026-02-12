import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../lib/utils";
import {
  SaveStatusIndicator,
  type MindMapSaveStatus,
} from "./SaveStatusIndicator";

interface HeaderProps {
  title?: string;
  className?: string;
  saveStatus?: MindMapSaveStatus | null;
  saveStatusClassName?: string;
  saveStatusLabels?: Partial<Record<MindMapSaveStatus, string>>;
}

export function Header({
  title = "Nodex",
  className,
  saveStatus = null,
  saveStatusClassName,
  saveStatusLabels,
}: HeaderProps) {
  const { zenMode } = useMindMapState(
    useShallow((state) => ({
      zenMode: state.zenMode,
    })),
  );

  return (
    <header
      data-zen={zenMode}
      className={cn(
        "overflow-hidden border-b flex items-center w-full border-slate-200 bg-white px-4 py-3 text-base font-semibold transition-all duration-200 data-[zen=true]:pointer-events-none data-[zen=true]:max-h-0 data-[zen=true]:-translate-y-2 data-[zen=true]:opacity-0 max-h-16 translate-y-0 opacity-100",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 w-full">
        <span className="truncate">{title}</span>

        {saveStatus ? (
          <SaveStatusIndicator
            status={saveStatus}
            className={saveStatusClassName}
            labels={saveStatusLabels}
          />
        ) : null}
      </div>
    </header>
  );
}
