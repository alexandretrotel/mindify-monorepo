import { getTextSizeClass } from "@/utils/typography";
import React from "react";

export default function Semibold({
  children,
  size
}: Readonly<{ children: React.ReactNode; size?: string }>) {
  return (
    <span className={`font-semibold text-foreground ${!!size && getTextSizeClass(size)}`}>
      {children}
    </span>
  );
}
