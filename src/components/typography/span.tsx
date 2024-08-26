import React from "react";
import { getPrimaryColor, getTextSizeClass } from "@/utils/typography";

export default function Span({
  children,
  center,
  size,
  semibold,
  primaryColor,
  onPrimaryBackground,
  isRed
}: Readonly<{
  children: React.ReactNode;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  semibold?: boolean;
  primaryColor?: boolean;
  onPrimaryBackground?: boolean;
  isRed?: boolean;
}>) {
  return (
    <span
      className={`${!!semibold && "font-semibold"} ${
        isRed
          ? "text-red-500"
          : getPrimaryColor(primaryColor as boolean, onPrimaryBackground as boolean)
      } ${!!center && "text-center"} ${getTextSizeClass(size as string)}`}
    >
      {children}
    </span>
  );
}
