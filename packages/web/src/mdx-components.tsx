import type { MDXComponents } from "mdx/types";
import React from "react";

// typography components
import { Blockquote } from "@/components/typography/blockquote";
import Bold from "@/components/typography/bold";
import H1 from "@/components/typography/h1";
import H2 from "@/components/typography/h2";
import H3 from "@/components/typography/h3";
import H4 from "@/components/typography/h4";
import H5 from "@/components/typography/h5";
import Semibold from "@/components/typography/semibold";
import { InlineCode } from "@/components/typography/inline-code";
import { Large } from "@/components/typography/large";
import { Lead } from "@/components/typography/lead";
import { Muted } from "@/components/typography/muted";
import P from "@/components/typography/p";
import { Small } from "@/components/typography/small";
import Span from "@/components/typography/span";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <H1 className="mb-6 mt-12">{children}</H1>,
    h2: ({ children }) => <H2 className="mb-4 mt-10">{children}</H2>,
    h3: ({ children }) => <H3 className="mb-3 mt-8">{children}</H3>,
    h4: ({ children }) => <H4 className="mb-2 mt-6">{children}</H4>,
    h5: ({ children }) => <H5 className="mb-2 mt-4">{children}</H5>,
    strong: ({ children }) => <Semibold>{children}</Semibold>,
    p: ({ children }) => <P className="my-4">{children}</P>,
    span: ({ children }) => <Span>{children}</Span>,
    small: ({ children }) => <Small>{children}</Small>,
    large: ({ children }) => <Large>{children}</Large>,
    blockquote: ({ children }) => <Blockquote className="my-6">{children}</Blockquote>,
    ul: ({ children }) => {
      return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
    },
    inlineCode: InlineCode,
    lead: ({ children }) => <Lead className="my-6">{children}</Lead>,
    bold: ({ children }) => <Bold>{children}</Bold>,
    muted: ({ children }) => <Muted>{children}</Muted>,
    a: ({ children, href }) => {
      return (
        <a href={href} target="_blank" className="text-blue-500 hover:underline">
          {children}
        </a>
      );
    },
    ...components
  };
}
