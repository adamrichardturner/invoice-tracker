import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse-fade rounded-md bg-muted/60 dark:bg-muted/20",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
