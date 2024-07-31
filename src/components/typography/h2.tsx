export default function H2({
  children,
  center
}: Readonly<{
  children: React.ReactNode;
  center?: boolean;
}>) {
  return <h2 className={`text-3xl font-semibold ${!!center && "text-center"}`}>{children}</h2>;
}
