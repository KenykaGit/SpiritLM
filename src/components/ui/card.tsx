import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("min-w-0 rounded-[15px] border border-transparent bg-[#1b1b1b]", className)}
      data-slot="card"
      {...props}
    />
  );
}
