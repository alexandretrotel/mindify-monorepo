export default function H3Span({
  children,
  muted,
  onPrimaryBackground
}: Readonly<{
  children: React.ReactNode;
  muted?: boolean;
  onPrimaryBackground?: boolean;
}>) {
  return (
    <span
      className={`text-2xl font-semibold ${muted ? "text-muted-foreground" : onPrimaryBackground ? "text-primary-foreground" : "text-foreground"}`}
    >
      {children}
    </span>
  );
}
