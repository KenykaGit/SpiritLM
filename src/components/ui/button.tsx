import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2.5 whitespace-nowrap font-[inherit] no-underline transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#ffe02e]",
  {
    variants: {
    variant: {
      default:
        "bg-[#ffe02e] !text-[#14130a] shadow-sm hover:-translate-y-px hover:bg-[#ffeb61] hover:!text-[#14130a]",
      ghost: "bg-transparent text-[#d1d0ca] hover:bg-[#171715] hover:text-[#f3f2ee]",
      outline:
        "border border-[#42423d] bg-[#121210] text-[#d1d0ca] hover:border-[#ffe02e] hover:bg-[#1b1a13] hover:text-[#ffe02e]",
      link: "min-h-[38px] rounded-none border-0 bg-transparent p-0 text-left text-[13px] font-semibold text-[#ffe02e] hover:text-[#fff09b]",
    },
    size: {
      default: "min-h-11 rounded-[9px] px-4 text-sm font-semibold",
      sm: "min-h-[38px] rounded-[9px] px-[13px] text-xs font-semibold",
      lg: "min-h-12 rounded-[10px] px-[18px] text-sm font-semibold",
      icon: "size-9 rounded-full p-0",
    },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}
