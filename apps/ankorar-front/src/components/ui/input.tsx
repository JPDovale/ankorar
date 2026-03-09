import * as React from "react";
import { cn } from "@/lib/utils";

function InputRoot({
  className,
  disabled = false,
  ...props
}: React.ComponentProps<"div"> & { disabled?: boolean }) {
  return (
    <div
      data-disabled={disabled}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function InputError({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-xs text-ds-danger", className)}
      {...props}
    />
  );
}

function InputBox({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group rounded-lg border border-navy-200/80 bg-white flex gap-2.5 px-4 items-center",
        "focus-within:ring-2 focus-within:ring-amber-400/50 focus-within:ring-offset-2 focus-within:ring-offset-ds-surface focus-within:bg-amber-50/30",
        "data-[disabled=true]:opacity-40 data-[disabled=true]:cursor-not-allowed",
        "data-[has-error=true]:border-ds-danger/50 data-[has-error=true]:focus-within:ring-2 data-[has-error=true]:focus-within:ring-ds-danger/15",
        className
      )}
      {...props}
    />
  );
}

function InputIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "size-6 flex shrink-0 items-center justify-center text-text-muted",
        className
      )}
      {...props}
    />
  );
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "min-w-0 flex-1 border-0 bg-transparent outline-none py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors",
          "disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    data-slot="input"
    className={cn(
      "w-full bg-white border border-navy-200/80 rounded-md py-2.5 px-3.5 text-sm text-text-primary placeholder:text-text-muted outline-none resize-y min-h-[80px] transition-colors",
      "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/25 focus:bg-amber-50/30",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

function InputLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-xs font-bold tracking-wider uppercase text-text-secondary",
        className
      )}
      {...props}
    />
  );
}

function InputHint({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("text-xs text-text-muted", className)} {...props} />
  );
}

export {
  Input,
  InputRoot,
  InputIcon,
  InputBox,
  InputError,
  InputLabel,
  InputHint,
  Textarea,
};
