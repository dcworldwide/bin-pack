import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root className={cn("relative flex h-11 w-full touch-none items-center select-none", className)} {...props}>
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full bg-primary shadow-[0_0_0_1px_rgba(12,13,15,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70" />
    </SliderPrimitive.Root>
  );
}
