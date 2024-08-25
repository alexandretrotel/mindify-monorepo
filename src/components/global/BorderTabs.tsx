import { Tabs, TabsList, TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import Link from "next/link";
import React from "react";

const BorderTabs = async ({
  children,
  elements,
  defaultTab
}: {
  children: React.ReactNode[];
  elements: {
    label: string;
    value: string;
  }[];
  defaultTab?: string;
}) => {
  return (
    <Tabs defaultValue={defaultTab ?? elements?.[0]?.value} className="flex flex-col gap-8">
      <TabsList className="w-full border-b border-border">
        <div className="hide-scrollbar -mb-[1px] flex items-center justify-start gap-6 overflow-x-auto pt-1 font-semibold text-muted-foreground md:gap-8">
          {elements?.map((element) => (
            <TabsTrigger
              key={element?.value}
              value={element.value}
              className="inline-block whitespace-nowrap border-b-2 border-transparent py-2 text-base hover:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-primary data-[state=active]:text-foreground lg:text-lg"
              asChild
            >
              <Link href={`?tab=${element.value}`} passHref>
                {element.label}
              </Link>
            </TabsTrigger>
          ))}
        </div>
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
