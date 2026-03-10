interface NotesGraphTooltipProps {
  title: string;
  x: number;
  y: number;
}

export function NotesGraphTooltip({ title, x, y }: NotesGraphTooltipProps) {
  return (
    <div
      className="pointer-events-none absolute z-10 max-w-[200px] truncate rounded px-2 py-1 text-xs text-[#c5d4e0]"
      style={{
        left: x + 12,
        top: y - 8,
        background: "var(--navy-900, #0d1b2a)",
        border: "1px solid #1a3044",
      }}
    >
      {title}
    </div>
  );
}
