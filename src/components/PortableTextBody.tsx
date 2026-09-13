import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[16px] leading-[1.75] text-ink-2">{children}</p>
    ),
    h1: ({ children }) => (
      <h2 className="mt-9 mb-3 font-serif text-[26px] font-normal text-brand-green">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="mt-9 mb-3 font-serif text-[22px] font-normal text-brand-green">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-2.5 font-serif text-xl font-normal text-brand-green">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-7 mb-2 font-serif text-lg font-normal text-brand-green">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-brand-gold pl-4 text-[16px] leading-[1.75] text-ink-2 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-5 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-5 list-decimal space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[15px] leading-relaxed text-ink-2">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-[15px] leading-relaxed text-ink-2">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    code: ({ children }) => (
      <code className="rounded bg-paper-2 px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          className="text-brand-green underline decoration-brand-gold underline-offset-2 hover:text-brand-gold"
        >
          {children}
        </a>
      );
    },
  },
};

type PortableTextBodyProps = {
  value: PortableTextBlock[];
};

export function PortableTextBody({ value }: PortableTextBodyProps) {
  return (
    <div className="mt-7">
      <PortableText value={value} components={portableTextComponents} />
    </div>
  );
}
