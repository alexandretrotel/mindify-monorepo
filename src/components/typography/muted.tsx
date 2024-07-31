import { getTextSizeClass } from "@/utils/typography";
import React from "react";

export function Muted({
  children,
  size,
  center
}: Readonly<{ children: React.ReactNode; size?: "xs" | "sm" | "md" | "lg"; center?: boolean }>) {
  return (
    <span
      className={`${getTextSizeClass(size as string)} ${!!center && "text-center"} text-muted-foreground`}
    >
      {children}
    </span>
  );
}
