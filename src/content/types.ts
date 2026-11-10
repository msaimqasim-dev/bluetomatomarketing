/** A locally hosted, optimised image plus the official URL it was produced from. */
export type Img = {
  /** Path relative to the built index.html (files live in /public/images). */
  src: string;
  /** Optional responsive candidates. */
  srcSet?: string;
  width: number;
  height: number;
  alt: string;
  /** Original asset on the official Blue Tomato site (documented source + load fallback). */
  origin: string;
  /** object-position used when the frame crops the image. */
  position?: string;
};
