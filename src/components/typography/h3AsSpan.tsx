export default function TypographyH3AsSpan({
  children,
  muted
}: Readonly<{
  children: React.ReactNode;
  muted?: boolean;
}>) {
  return (
    <span className={`text-2xl font-semibold ${!!muted && "text-muted-foreground"}`}>
      {children}
    </span>
  );
}
