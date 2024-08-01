export default function H1({ children }: Readonly<{ children: React.ReactNode }>) {
  return <h1 className="text-4xl font-extrabold lg:text-5xl">{children}</h1>;
}
