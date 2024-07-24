import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="md:flew-row mx-auto flex w-full max-w-7xl flex-col justify-between p-4 py-12 md:p-8">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
