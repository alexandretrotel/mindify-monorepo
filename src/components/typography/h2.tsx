import { cn } from "@/lib/utils";

export default function H2({
  children,
  center,
  className
}: Readonly<{
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}>) {
  return (
    <h2 className={cn(`text-3xl font-semibold ${!!center && "text-center"}`, className)}>
      {children}
    </h2>
  );
}
