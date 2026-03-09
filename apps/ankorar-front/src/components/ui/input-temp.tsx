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
      className={cn(
        "flex flex-col gap-1 data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function InputError({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("text-xs text-red-800", className)} {...props} />;
}

function InputBox({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border border-zinc-400 rounded-lg flex gap-2.5 px-4 items-center data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed data-[has-error=true]:border-red-800",
        className
      )}
      {...props}
    />
  );
}

function InputIcon({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("w-6 h-6 flex", className)} {...props} />;
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(
          "outline-none w-full placeholder:text-zinc-400 text-sm disabled:cursor-not-allowed py-2 ",
          className
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, InputRoot, InputIcon, InputBox, InputError };
