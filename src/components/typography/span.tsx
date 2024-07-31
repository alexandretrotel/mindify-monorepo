import React from "react";
import { getPrimaryColor, getTextSizeClass } from "@/utils/typography";

export default function Span({
  children,
  center,
  size,
  semibold,
  primaryColor
}: Readonly<{
  children: React.ReactNode;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  semibold?: boolean;
  primaryColor?: boolean;
}>) {
  return (
    <span
      className={`${!!semibold && "font-semibold"} ${getPrimaryColor(
        primaryColor as boolean
      )} ${!!center && "text-center"} ${getTextSizeClass(size as string)}`}
    >
      {children}
    </span>
  );
}
