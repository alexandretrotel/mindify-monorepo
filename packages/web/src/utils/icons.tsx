import React from "react";
import { icons } from "@/data/icons";

export const generateMetaTags = (icons: { src: string; sizes: string }[]) => {
  return icons.map((icon) => (
    <link key={icon.src} rel="icon" type="image/png" sizes={icon.sizes} href={icon.src} />
  ));
};

export const MetaTags: React.FC = () => {
  return <React.Fragment>{generateMetaTags(icons)}</React.Fragment>;
};
