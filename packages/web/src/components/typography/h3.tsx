import { cn } from "@/lib/utils";

export default function H3({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <h3 className={cn("text-2xl font-semibold", className)}>{children}</h3>;
}
