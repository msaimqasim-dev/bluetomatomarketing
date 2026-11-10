import { cssVars } from "../hooks/useReveal";

/** The four sentences of the live Philosophy paragraph, one per line. */
const PRINCIPLES = [
  "Sharper strategy wins.",
  "Restraint signals confidence.",
  "Precision earns attention.",
  "Consistency builds trust competitors can’t replicate.",
];

/** The four drivers named in the live Results paragraph, set as a list. */
const DRIVERS = ["qualified leads", "stronger positioning", "higher conversion", "sustained momentum"];

/**
 * Strategy — the live homepage's three positioning blocks ("Our Focus",
 * "Philosophy" and "Results") merged into one cohesive section. Every sentence
 * is preserved word for word; only the order of the drivers and the four
 * philosophy sentences is expressed as lists. See docs/CONTENT-AUDIT.md.
 */
export function Strategy() {
  return (
    <section id="strategy" className="section strategy theme-navy" aria-labelledby="strategy-title">
      <div className="wrap">
        <header className="strategy__intro">
          <div className="strategy__headline">
            <p className="eyebrow" data-reveal>
              Our Focus
            </p>
            <h2 id="strategy-title" className="strategy__title" data-reveal data-lines>
              <span>Strategy First.</span> <span>Always.</span>
            </h2>
          </div>

          <div className="strategy__intro-copy" data-reveal style={cssVars({ "--d": "120ms" })}>
            <p className="strategy__lead">
              Premium brands don’t compete on volume. They compete on perception, precision, and presence.
            </p>
            <p>
              We design marketing ecosystems that elevate brand position and drive measurable growth across digital,
              print, and experience.
            </p>
            <p className="strategy__strong">Every move is intentional. Every asset performs.</p>
          </div>
        </header>

        <div className="strategy__divider" role="presentation" />

        <div className="strategy__body">
          <article id="philosophy" className="strategy__block" aria-labelledby="strategy-philosophy">
            <header className="strategy__block-head">
              <p className="eyebrow">
                <span className="strategy__num">01</span> Philosophy
              </p>
              <h3 id="strategy-philosophy" className="strategy__subtitle" data-reveal data-lines>
                <span>Built With Intent.</span> <span>Backed by Results.</span>
              </h3>
              <p className="strategy__lead strategy__lead--tight">In crowded markets, louder isn’t better.</p>
            </header>

            <ol className="strategy__principles">
              {PRINCIPLES.map((principle, index) => (
                <li key={principle} data-reveal style={cssVars({ "--d": `${index * 80}ms` })}>
                  <span>{principle}</span>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ol>

            <p className="strategy__closing" data-reveal>
              We create brands and campaigns that don’t need to shout…because they’re impossible to ignore.
            </p>
          </article>

          <article id="results" className="strategy__block" aria-labelledby="strategy-results">
            <header className="strategy__block-head">
              <p className="eyebrow">
                <span className="strategy__num">02</span> Results
              </p>
              <h3 id="strategy-results" className="strategy__subtitle" data-reveal data-lines>
                <span>Measured.</span> <span>Meaningful.</span> <span>Scalable.</span>
              </h3>
              <p className="strategy__lead strategy__lead--tight">Beautiful creative is only the beginning.</p>
            </header>

            <div className="strategy__drivers-wrap" data-reveal>
              <p>We focus on what actually drives growth:</p>
              <ul className="strategy__drivers">
                {DRIVERS.map((driver) => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
            </div>

            <p className="strategy__result" data-reveal>
              Our clients don’t just get noticed – they get chosen.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
