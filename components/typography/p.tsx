export default function TypographyP({
  children,
  muted,
  center
}: {
  children: React.ReactNode;
  muted?: boolean;
  center?: boolean;
}) {
  return (
    <p
      className={`${muted ? "text-muted-foreground" : "text-primary-foreground"} ${center && "text-center"}`}
    >
      {children}
    </p>
  );
}
