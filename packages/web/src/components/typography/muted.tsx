import { cn } from "@/lib/utils";
import { getTextSizeClass } from "@/utils/typography";
import React from "react";

export function Muted({
  children,
  size,
  center,
  className
}: Readonly<{
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg";
  center?: boolean;
  className?: string;
}>) {
  return (
    <span
      className={cn(
        `${getTextSizeClass(size as string)} ${!!center && "text-center"} text-muted-foreground`,
        className
      )}
    >
      {children}
    </span>
  );
}
