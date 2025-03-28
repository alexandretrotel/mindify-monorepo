import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Muted } from "@/components/typography/muted";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";
type Cursor = "help" | "pointer";

const cursorClasses = {
  pointer: "cursor-pointer",
  help: "cursor-help"
};

const ResponsiveTooltip = ({
  children,
  text,
  side,
  align,
  cursor
}: {
  children: React.ReactNode;
  text: string;
  side?: Side;
  align?: Align;
  cursor?: Cursor;
}) => {
  return (
    <div className={`${cursorClasses[cursor as Cursor]}`}>
      <div className={`hidden md:block`}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side} align={align} className="max-w-sm">
              <Muted>{text}</Muted>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="block md:hidden">
        <Popover>
          <PopoverTrigger asChild>{children}</PopoverTrigger>
          <PopoverContent side={side} align={align} className="max-w-sm">
            <Muted>{text}</Muted>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ResponsiveTooltip;
