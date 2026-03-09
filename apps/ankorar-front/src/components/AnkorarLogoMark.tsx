import { cn } from "@/lib/utils";

/**
 * Logo mark do Ankorar (elos de corrente). Definido no Design System.
 * Use currentColor ou style/className para cor; em fundo claro: #A86820 (amber-600), em fundo escuro: #D4882A.
 */
export function AnkorarLogoMark({
  className,
  style,
  ...props
}: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      className={cn("shrink-0", className)}
      style={style}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      {...props}
    >
      <rect x="2" y="9" width="10" height="6" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <rect x="16" y="13" width="10" height="6" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <rect x="9" y="5" width="10" height="6" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  );
}
