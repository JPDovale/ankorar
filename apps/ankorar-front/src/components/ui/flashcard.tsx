import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Minus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

function FlashcardRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-amber-400/30 bg-ds-surface-elevated p-6 overflow-hidden",
        "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-to-r before:from-amber-600 before:to-amber-300",
        className
      )}
      {...props}
    />
  );
}

function FlashcardLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-xs font-bold tracking-widest uppercase text-amber-600 mb-3",
        className
      )}
      {...props}
    />
  );
}

function FlashcardQuestion({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "text-base font-semibold text-navy-900 leading-snug mb-4",
        className
      )}
      {...props}
    />
  );
}

function RetentionRow({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 bg-navy-100/50 py-2.5 px-3.5 rounded-md border border-navy-200/50",
        className
      )}
      {...props}
    />
  );
}

function RetentionLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-xs text-text-muted flex-1", className)}
      {...props}
    />
  );
}

function RetentionBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("w-[100px] h-1 rounded-full bg-navy-200/60 overflow-hidden", className)}
      {...props}
    />
  );
}

function RetentionFill({
  className,
  value = 0,
  ...props
}: React.ComponentProps<"div"> & { value?: number }) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn(
        "h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-[width] duration-300",
        className
      )}
      style={{ width: `${width}%` }}
      {...props}
    />
  );
}

function RetentionPct({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-xs font-bold text-amber-600 w-8 text-right", className)}
      {...props}
    />
  );
}

function FlashcardActions({
  className,
  onWrong,
  onHard,
  onCorrect,
  ...props
}: React.ComponentProps<"div"> & {
  onWrong?: () => void;
  onHard?: () => void;
  onCorrect?: () => void;
}) {
  return (
    <div
      className={cn("flex gap-3 mt-4", className)}
      {...props}
    >
      {onWrong && (
        <Button variant="destructive" size="sm" className="flex-1" onClick={onWrong}>
          <X className="size-4" />
          Errei
        </Button>
      )}
      {onHard && (
        <Button variant="outline" size="sm" className="flex-1" onClick={onHard}>
          <Minus className="size-4" />
          Difícil
        </Button>
      )}
      {onCorrect && (
        <Button
          size="sm"
          className="flex-1 bg-ds-success/15 text-ds-success border-ds-success/25 hover:bg-ds-success/25"
          onClick={onCorrect}
        >
          <Check className="size-4" />
          Acertei
        </Button>
      )}
    </div>
  );
}

export {
  FlashcardRoot,
  FlashcardLabel,
  FlashcardQuestion,
  FlashcardActions,
  RetentionRow,
  RetentionLabel,
  RetentionBar,
  RetentionFill,
  RetentionPct,
};
