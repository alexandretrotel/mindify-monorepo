import { cn } from "@/lib/utils";

export default function H4({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <h4 className={cn("text-xl font-semibold", className)}>{children}</h4>;
}
