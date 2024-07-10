function getTextSizeClass(size: string): string {
  if (size === "md") {
    return "text-md";
  } else if (size === "lg") {
    return "text-lg";
  } else {
    return "text-md"; // Default case
  }
}

export default function TypographyP({
  children,
  muted,
  center,
  size
}: Readonly<{
  children: React.ReactNode;
  muted?: boolean;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}>) {
  return (
    <p
      className={`${muted ? "text-muted-foreground" : "text-primary-foreground"} ${center && "text-center"} ${
        size && getTextSizeClass(size)
      }`}
    >
      {children}
    </p>
  );
}
