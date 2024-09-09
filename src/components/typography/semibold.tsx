import { getTextSizeClass } from "@/utils/typography";
import React from "react";

export default function Semibold({
  children,
  size,
  onPrimaryBackground,
  primaryColor
}: Readonly<{
  children: React.ReactNode;
  size?: string;
  onPrimaryBackground?: boolean;
  primaryColor?: boolean;
}>) {
  return (
    <span
      className={`font-semibold ${primaryColor ? "text-primary" : onPrimaryBackground ? "text-primary-foreground" : "text-foreground"} ${!!size && getTextSizeClass(size)}`}
    >
      {children}
    </span>
  );
}
