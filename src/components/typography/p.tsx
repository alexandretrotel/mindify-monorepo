import { getTextSizeClass } from "@/utils/typography";

export default function P({
  children,
  center,
  size
}: Readonly<{
  children: React.ReactNode;
  center?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}>) {
  return (
    <p className={`${!!center && "text-center"} ${!!size && getTextSizeClass(size)}`}>{children}</p>
  );
}
