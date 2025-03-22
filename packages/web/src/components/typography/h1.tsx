import { cn } from "@/lib/utils";

export default function H1({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <h1 className={cn("text-4xl font-semibold lg:text-5xl", className)}>{children}</h1>;
}
