import { LOGO_MARKUP, LOGO_VIEWBOX } from "../../content/generated/logo";

/**
 * The original Blue Tomato logo (vector paths unchanged, fills removed so it
 * inherits `currentColor`). Rendered once as a sprite and referenced with
 * <use>, so the 13 KB of path data is not duplicated per instance.
 */
export function LogoSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <symbol id="bt-logo" viewBox={LOGO_VIEWBOX} dangerouslySetInnerHTML={{ __html: LOGO_MARKUP }} />
    </svg>
  );
}

type LogoProps = { className?: string; decorative?: boolean };

export function Logo({ className = "", decorative = false }: LogoProps) {
  return (
    <svg
      className={`logo ${className}`}
      viewBox={LOGO_VIEWBOX}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "blue tomato — Building Brands Since 2002"}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      <use href="#bt-logo" />
    </svg>
  );
}
