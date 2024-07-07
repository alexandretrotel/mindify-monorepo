import React from "react";

export default function TypographySpan({
  children,
  muted,
  center,
  size
}: {
  children: React.ReactNode;
  muted?: boolean;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}) {
  return (
    <span
      className={`${muted ? "text-muted-foreground" : "text-primary-foreground"} ${center && "text-center"} ${
        size === "xs"
          ? "text-xs"
          : size === "sm"
            ? "text-sm"
            : size === "md"
              ? "text-md"
              : size === "lg"
                ? "text-lg"
                : "text-md"
      }`}
    >
      {children}
    </span>
  );
}
