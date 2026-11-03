import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-wide", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      ok: "bg-ok/15 text-ok",
      danger: "bg-destructive/15 text-destructive",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
