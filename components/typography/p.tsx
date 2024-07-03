import React from "react";

const TypographyP = ({ children }: { children: React.ReactNode }) => {
  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
};

export default TypographyP;
