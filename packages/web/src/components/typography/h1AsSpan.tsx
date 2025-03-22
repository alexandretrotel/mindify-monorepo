export default function H1Span({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className="text-4xl font-semibold lg:text-5xl">{children}</span>;
}
