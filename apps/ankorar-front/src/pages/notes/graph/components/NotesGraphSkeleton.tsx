export function NotesGraphSkeleton() {
  return (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-[#070f18]">
      <svg width="100%" height="100%" className="opacity-30">
        {[
          { cx: "20%", cy: "30%" },
          { cx: "50%", cy: "20%" },
          { cx: "75%", cy: "40%" },
          { cx: "35%", cy: "65%" },
          { cx: "60%", cy: "70%" },
        ].map((pos, i) => (
          <circle
            key={i}
            cx={pos.cx}
            cy={pos.cy}
            r={16}
            fill="#122233"
            stroke="#1a3044"
            strokeWidth={2}
          />
        ))}
        <line x1="20%" y1="30%" x2="50%" y2="20%" stroke="#1a3044" strokeWidth={1} />
        <line x1="50%" y1="20%" x2="75%" y2="40%" stroke="#1a3044" strokeWidth={1} />
        <line x1="35%" y1="65%" x2="60%" y2="70%" stroke="#1a3044" strokeWidth={1} />
      </svg>
    </div>
  );
}
