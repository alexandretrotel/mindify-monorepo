import { getTextSizeClass } from "@/utils/typography";
import React from "react";

export default function Semibold({
  children,
  size,
  onPrimaryBackground
}: Readonly<{ children: React.ReactNode; size?: string; onPrimaryBackground?: boolean }>) {
  return (
    <span
      className={`font-semibold ${onPrimaryBackground ? "text-primary-foreground" : "text-foreground"} ${!!size && getTextSizeClass(size)}`}
    >
      {children}
    </span>
  );
}
