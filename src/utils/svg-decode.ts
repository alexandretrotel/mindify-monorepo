export const decodeSVG = (dataUrl: string) => {
  const base64Index = dataUrl.indexOf("base64,") + "base64,".length;
  const base64 = dataUrl.substring(base64Index);
  const svgContent = atob(base64);
  return svgContent;
};
