import { Tabs, TabsList, TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import React from "react";

const BorderTabs = async ({
  children,
  elements
}: {
  children: React.ReactNode[];
  elements: {
    label: string;
    value: string;
  }[];
}) => {
  return (
    <Tabs defaultValue={elements?.[0]?.value} className="flex flex-col gap-8">
      <TabsList className="flex w-full items-center gap-6 border-b border-border font-semibold text-muted-foreground md:gap-8">
        {elements?.map((element) => (
          <TabsTrigger
            key={element?.value}
            value={element.value}
            className="border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground"
          >
            {element.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {elements?.map((element, index) => (
        <TabsContent key={element?.value} value={element.value}>
          {children[index]}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default BorderTabs;
