export default function TypographyH2({
  children,
  center
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return <h2 className={`text-3xl font-semibold ${center && "text-center"}`}>{children}</h2>;
}
