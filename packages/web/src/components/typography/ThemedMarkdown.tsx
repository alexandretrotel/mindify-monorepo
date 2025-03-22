import React from "react";
import H1 from "@/components/typography/h1";
import H2 from "@/components/typography/h2";
import H4 from "@/components/typography/h4";
import H5 from "@/components/typography/h5";
import P from "@/components/typography/p";
import { Blockquote } from "@/components/typography/blockquote";
import { InlineCode } from "@/components/typography/inline-code";
import { Large } from "@/components/typography/large";
import { Lead } from "@/components/typography/lead";
import Semibold from "@/components/typography/semibold";
import { Small } from "@/components/typography/small";
import Span from "@/components/typography/span";
import Markdown from "markdown-to-jsx";
import H3 from "@/components/typography/h3";

export default function ThemedMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: {
            component: H1,
            props: {
              className: "mb-4 mt-8"
            }
          },
          h2: {
            component: H2,
            props: {
              className: "mb-4 mt-8"
            }
          },
          h3: {
            component: H3,
            props: {
              className: "mb-4 mt-8"
            }
          },
          h4: {
            component: H4,
            props: {
              className: "mb-4 mt-8"
            }
          },
          h5: {
            component: H5,
            props: {
              className: "mb-4 mt-8"
            }
          },
          p: {
            component: P,
            props: {
              className: "my-4"
            }
          },
          blockquote: {
            component: Blockquote,
            props: {
              className: "my-4"
            }
          },
          strong: {
            component: Semibold
          },
          pre: {
            component: InlineCode
          },
          large: {
            component: Large
          },
          lead: {
            component: Lead
          },
          em: {
            component: Semibold
          },
          small: {
            component: Small
          },
          span: {
            component: Span
          },
          li: {
            component: listItem
          },
          ol: {
            component: orderedListItem
          }
        }
      }}
    >
      {children}
    </Markdown>
  );
}

const listItem = ({
  children,
  props
}: {
  children: React.ReactNode;
  props: React.HTMLProps<HTMLLIElement>;
}) => (
  <li className="ml-4 list-disc" {...props}>
    {children}
  </li>
);

const orderedListItem = ({
  children,
  props
}: {
  children: React.ReactNode;
  props: React.HTMLProps<HTMLLIElement>;
}) => (
  <li className="ml-4 list-decimal" {...props}>
    {children}
  </li>
);
