import type { AnchorHTMLAttributes, ReactNode } from "react";

type LiveLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

/**
 * Link to a page that is not part of this phase (homepage only). It points at
 * the verified, existing URL on the live Blue Tomato site and opens in a new
 * tab so reviewers keep the prototype open. When the inner pages are built,
 * swap this component for a normal internal link.
 */
export function LiveLink({ href, children, ...rest }: LiveLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener" {...rest}>
      {children}
      <span className="visually-hidden"> (opens the current live page in a new tab)</span>
    </a>
  );
}
