import React from "react";
import { getTextSizeClass } from "@/utils/typography/text";

const mutedCondition = (muted: boolean) =>
  muted ? "text-muted-foreground" : "text-primary-foreground";

const defaultColor = (isDefaultColor: boolean, muted: boolean) =>
  isDefaultColor ? "text-black dark:text-white" : mutedCondition(muted);

const primaryColor = (isPrimaryColor: boolean, isDefaultColor: boolean, muted: boolean) =>
  isPrimaryColor ? "text-primary" : defaultColor(isDefaultColor, muted);

export default function TypographySpan({
  children,
  muted,
  center,
  size,
  isDefaultColor,
  semibold,
  isPrimaryColor
}: Readonly<{
  children: React.ReactNode;
  muted?: boolean;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  isDefaultColor?: boolean;
  semibold?: boolean;
  isPrimaryColor?: boolean;
}>) {
  return (
    <span
      className={`${semibold && "font-semibold"} ${primaryColor(
        isPrimaryColor as boolean,
        isDefaultColor as boolean,
        muted as boolean
      )} ${center && "text-center"} ${size && getTextSizeClass(size)}`}
    >
      {children}
    </span>
  );
}
