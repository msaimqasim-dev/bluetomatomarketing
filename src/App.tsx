import { useCallback, useState } from "react";
import { About } from "./components/About";
import { CallToAction } from "./components/CallToAction";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { MobileMenu } from "./components/MobileMenu";
import { Strategy } from "./components/Strategy";
import { ServicesStack } from "./components/ServicesStack";
import { Testimonials } from "./components/Testimonials";
import { Trust } from "./components/Trust";
import { Work } from "./components/Work";
import { LogoSprite } from "./components/ui/Logo";
import { useMotion } from "./hooks/useMotion";
import { useReveal } from "./hooks/useReveal";
import { ScrollProgress } from "./components/ui/ScrollProgress";

/**
 * Blue Tomato — homepage. Sections are rendered in the agreed storytelling
 * order; each one lives in its own component under /components.
 *
 * The Industries preview is intentionally not rendered (content preserved in
 * components/Industries.tsx + content/site.ts for the future Industries page).
 */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useMotion();
  useReveal();

  return (
    <>
      <LogoSprite />
      <ScrollProgress />

      {/* Everything behind the mobile menu becomes inert while it is open. */}
      <div id="site" inert={menuOpen}>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header menuOpen={menuOpen} onOpenMenu={openMenu} />

        <main id="main" tabIndex={-1}>
          <Hero />
          <Trust />
          <Work />
          <ServicesStack />
          <Strategy />
          <About />
          <Testimonials />
          <CallToAction />
        </main>

        <Footer />
      </div>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
