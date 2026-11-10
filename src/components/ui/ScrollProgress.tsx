/** Thin brand-blue reading-progress line. Purely decorative; driven by useMotion. */
export function ScrollProgress() {
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__bar" />
    </div>
  );
}
