import { cn } from "@/lib/utils";
import { getTextSizeClass } from "@/utils/typography";
import React from "react";

export default function Semibold({
  children,
  size,
  onPrimaryBackground,
  primaryColor,
  className
}: Readonly<{
  children: React.ReactNode;
  size?: string;
  onPrimaryBackground?: boolean;
  primaryColor?: boolean;
  className?: string;
}>) {
  return (
    <span
      className={cn(
        `font-semibold ${primaryColor ? "text-primary" : onPrimaryBackground ? "text-primary-foreground" : "text-foreground"} ${!!size && getTextSizeClass(size)}`,
        className
      )}
    >
      {children}
    </span>
  );
}
