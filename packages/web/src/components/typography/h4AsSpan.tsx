export default function H4Span({
  children,
  onPrimaryBackground
}: Readonly<{ children: React.ReactNode; onPrimaryBackground?: boolean }>) {
  return (
    <span
      className={`text-xl font-semibold ${onPrimaryBackground ? "text-primary-foreground" : "text-foreground"}`}
    >
      {children}
    </span>
  );
}
