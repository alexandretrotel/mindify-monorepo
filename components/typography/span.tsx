import React from "react";
import { getTextSizeClass } from "@/utils/typography/text";

const mutedCondition = (muted: boolean) =>
  muted ? "text-muted-foreground" : "text-primary-foreground";

export default function TypographySpan({
  children,
  muted,
  center,
  size,
  defaultColor,
  semibold
}: Readonly<{
  children: React.ReactNode;
  muted?: boolean;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  defaultColor?: boolean;
  semibold?: boolean;
}>) {
  return (
    <span
      className={`${semibold && "font-semibold"} ${defaultColor ? "text-black dark:text-white" : muted && mutedCondition(muted)} ${center && "text-center"} ${
        size && getTextSizeClass(size)
      }`}
    >
      {children}
    </span>
  );
}
