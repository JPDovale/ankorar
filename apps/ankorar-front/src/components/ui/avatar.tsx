import * as React from "react";
import { cn } from "@/lib/utils";

const avatarSizes = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[11px]",
  md: "size-10 text-[13px]",
  lg: "size-[52px] text-base",
  xl: "size-[68px] text-xl",
} as const;

const avatarVariants = {
  amber:
    "bg-gradient-to-br from-amber-600 to-amber-300 text-navy-950 border-2 border-navy-950",
  blue: "bg-gradient-to-br from-[#2a5aa8] to-ds-info text-white border-0",
  green:
    "bg-gradient-to-br from-[#1a6644] to-ds-success text-white border-0",
  navy: "bg-navy-200 text-navy-800 border border-navy-300/60",
} as const;

function Avatar({
  className,
  size = "md",
  variant = "amber",
  children,
  src,
  alt = "",
  ...props
}: React.ComponentProps<"div"> & {
  size?: keyof typeof avatarSizes;
  variant?: keyof typeof avatarVariants;
  src?: string | null;
  alt?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden",
        avatarSizes[size],
        avatarVariants[variant],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="size-full object-cover" />
      ) : (
        children
      )}
    </div>
  );
}

function AvatarStack({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex [&>*]:-ml-2.5 first:[&>*]:ml-0", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarStack, avatarSizes, avatarVariants };
