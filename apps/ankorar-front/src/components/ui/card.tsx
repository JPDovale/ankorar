import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const cardBase =
  "rounded-2xl border border-navy-200/50 bg-ds-surface-elevated p-6 transition-all duration-200 hover:border-navy-300/60 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(13,27,42,0.08)]";

function Card({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "amber";
}) {
  return (
    <div
      className={cn(
        cardBase,
        variant === "amber" &&
          "border-amber-400/30 bg-gradient-to-br from-amber-50/80 to-ds-surface-elevated",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-start justify-between mb-4", className)}
      {...props}
    />
  );
}

function CardIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "size-11 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-base font-bold text-navy-900 mb-1", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm text-text-muted leading-relaxed", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("text-sm text-text-muted leading-[1.65]", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-5 pt-4 border-t border-navy-200/50 flex items-center justify-between",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardIcon,
  CardTitle,
  CardDescription,
  CardContent,
  CardBody,
  CardFooter,
};
export type { LucideIcon };
