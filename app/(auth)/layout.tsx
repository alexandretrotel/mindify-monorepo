import React from "react";
import BackHome from "@/components/global/buttons/backHome";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen items-center justify-center p-4">
      {children}

      <div className="absolute left-0 top-0 px-4 py-8 md:p-8">
        <BackHome />
      </div>
    </div>
  );
};

export default AuthLayout;
