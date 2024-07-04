import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative flex h-screen items-center justify-center p-4">{children}</div>;
};

export default AuthLayout;
