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
      className={`leading-7 ${muted ? "text-muted-foreground" : "text-primary-foreground"} ${center && "text-center"}`}
    >
      {children}
    </p>
  );
}
