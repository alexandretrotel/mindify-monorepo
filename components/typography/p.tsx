export default function TypographyP({
  children,
  muted
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <p className={`leading-7 ${muted ? "text-muted-foreground" : "text-primary-foreground"}`}>
      {children}
    </p>
  );
}
