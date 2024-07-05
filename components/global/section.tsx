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
    <section id={id} className={`relative isolate px-6 pt-14 lg:px-8`}>
      <div className={`mx-auto ${fullWidth ? "w-full" : "max-w-2xl"} py-8 sm:py-12 lg:py-14`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
