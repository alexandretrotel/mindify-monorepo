export function getTextSizeClass(size: string): string {
  switch (size) {
    case "xs":
      return "text-xs";
    case "sm":
      return "text-sm";
    case "md":
      return "text-md";
    case "lg":
      return "text-lg";
    default:
      return "text-md";
  }
}
