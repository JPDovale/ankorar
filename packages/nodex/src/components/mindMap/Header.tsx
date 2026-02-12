import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";

interface HeaderProps {
  title: string;
}

export function Header({ title = "Nodex" }: HeaderProps) {
  const { zenMode } = useMindMapState(
    useShallow((state) => ({
      zenMode: state.zenMode,
    })),
  );

  return (
    <header
      data-zen={zenMode}
      className="overflow-hidden border-b border-slate-200 bg-white px-4 py-3 text-base font-semibold transition-all duration-200 data-[zen=true]:pointer-events-none data-[zen=true]:max-h-0 data-[zen=true]:-translate-y-2 data-[zen=true]:opacity-0 max-h-16 translate-y-0 opacity-100"
    >
      {title}
    </header>
  );
}
