import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full min-w-0 rounded-md bg-muted px-3 text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.08)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
        className,
      )}
      {...props}
    />
  );
}
