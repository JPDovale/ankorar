import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export type MindMapSaveStatus = "saved" | "unsaved" | "saving";

interface SaveStatusIndicatorProps {
  status: MindMapSaveStatus;
  className?: string;
  labels?: Partial<Record<MindMapSaveStatus, string>>;
}

const defaultLabels: Record<MindMapSaveStatus, string> = {
  saved: "Salvo",
  unsaved: "Não salvo",
  saving: "Salvando...",
};

export function SaveStatusIndicator({
  status,
  className,
  labels,
}: SaveStatusIndicatorProps) {
  const mergedLabels = {
    ...defaultLabels,
    ...labels,
  };

  if (status === "saving") {
    return (
      <span
        aria-label={mergedLabels.saving}
        title={mergedLabels.saving}
        className={cn("inline-flex items-center justify-center", className)}
      >
        <LoaderCircle className="size-4 animate-spin text-sky-600" />
      </span>
    );
  }

  if (status === "unsaved") {
    return (
      <span
        aria-label={mergedLabels.unsaved}
        title={mergedLabels.unsaved}
        className={cn("inline-flex items-center justify-center", className)}
      >
        <CircleAlert className="size-4 text-amber-600" />
      </span>
    );
  }

  return (
    <span
      aria-label={mergedLabels.saved}
      title={mergedLabels.saved}
      className={cn("inline-flex items-center justify-center", className)}
    >
      <CheckCircle2 className="size-4 text-emerald-600" />
    </span>
  );
}
