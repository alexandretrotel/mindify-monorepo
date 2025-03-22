import { cn } from "@/lib/utils";
import { getTextSizeClass } from "@/utils/typography";

export default function P({
  children,
  center,
  size,
  className
}: Readonly<{
  children: React.ReactNode;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}>) {
  return (
    <p
      className={cn(`${!!center && "text-center"} ${!!size && getTextSizeClass(size)}`, className)}
    >
      {children}
    </p>
  );
}
