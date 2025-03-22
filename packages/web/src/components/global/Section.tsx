import React from "react";

const Section = ({
  children,
  id,
  fullWidth
}: {
  children: React.ReactNode;
  id: string;
  fullWidth?: boolean;
}) => {
  return (
    <section id={id} className={`relative isolate px-6 lg:px-8`}>
      <div className={`mx-auto ${fullWidth ? "w-full" : "max-w-2xl"} py-16 sm:py-24 lg:py-28`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
