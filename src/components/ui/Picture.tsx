import { useState } from "react";
import type { Img } from "../../content/types";

type PictureProps = {
  image: Img;
  /** `sizes` hint for responsive candidates. */
  sizes?: string;
  /** Above-the-fold image: load eagerly with high priority. */
  priority?: boolean;
  /** Load immediately (e.g. a moving gallery) without claiming high priority. */
  eager?: boolean;
  className?: string;
};

/**
 * Local, optimised image with intrinsic dimensions (no layout shift) and lazy
 * loading by default. Hero gallery tiles are `eager` because they move through
 * the viewport — lazy loading would pop them in half-visible. If the local file
 * ever fails to load, it falls back once
 * to the documented original on the official Blue Tomato site.
 */
export function Picture({ image, sizes, priority = false, eager = false, className }: PictureProps) {
  const [useOrigin, setUseOrigin] = useState(false);

  return (
    <img
      className={className}
      src={useOrigin ? image.origin : image.src}
      srcSet={useOrigin ? undefined : image.srcSet}
      sizes={useOrigin || !image.srcSet ? undefined : sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={priority || eager ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      style={image.position ? { objectPosition: image.position } : undefined}
      onError={() => setUseOrigin(true)}
    />
  );
}
