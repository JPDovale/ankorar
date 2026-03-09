import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 font-semibold tracking-tight rounded-md border transition-all duration-200 disabled:pointer-events-none disabled:opacity-35 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-surface [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-amber-400 text-navy-950 border-transparent hover:bg-amber-300 hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(212,136,42,0.28)] active:translate-y-0",
        destructive:
          "bg-ds-danger/12 text-ds-danger border-ds-danger/30 hover:bg-ds-danger/20 hover:-translate-y-px",
        outline:
          "bg-transparent text-navy-900 border-navy-300 hover:bg-navy-100/80 hover:border-navy-400 hover:-translate-y-px",
        secondary:
          "bg-navy-100 text-navy-900 border-navy-200/80 hover:bg-navy-200/80 hover:border-navy-300 hover:-translate-y-px",
        ghost:
          "bg-transparent text-text-secondary border-transparent hover:bg-navy-100/80 hover:text-navy-900",
        link: "text-amber-600 underline-offset-4 hover:text-amber-500 hover:underline bg-transparent border-transparent",
        "amber-ghost":
          "bg-amber-400/15 text-amber-600 border-amber-400/30 hover:bg-amber-400/25 hover:border-amber-500/40",
      },
      size: {
        default: "h-9 px-4 text-sm py-2",
        sm: "text-xs px-3 py-1.5",
        lg: "text-base px-6 py-3",
        xl: "text-lg px-8 py-4",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
  };

function Button({
  className,
  variant,
  size,
  type = "button",
  asChild = false,
  icon: Icon,
  iconPosition = "left",
  children,
  ...props
}: ButtonProps) {
  const computedClassName = cn(buttonVariants({ variant, size, className }));
  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon />}
      {children}
      {Icon && iconPosition === "right" && <Icon />}
    </>
  );
  if (asChild && children) {
    const child = React.Children.only(children) as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(computedClassName, child.props?.className),
    });
  }
  return (
    <button type={type} className={computedClassName} {...props}>
      {content}
    </button>
  );
}

export { Button, buttonVariants };
