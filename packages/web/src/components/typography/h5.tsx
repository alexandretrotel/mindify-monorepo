import { cn } from "@/lib/utils";

export default function H5({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <h5 className={cn("text-md font-semibold", className)}>{children}</h5>;
}
