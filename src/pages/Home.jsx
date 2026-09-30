import HeroCanvas from "../components/hero/HeroCanvas";
import Hero from "../components/hero/Hero";
import About from "../components/sections/About";
import Marquee from "../components/sections/Marquee";
import KeyFacts from "../components/sections/KeyFacts";
import SelectedWork from "../components/sections/SelectedWork";
import Statement from "../components/sections/Statement";
import ServicesScene from "../components/sections/ServicesScene";
import ClientStories from "../components/sections/ClientStories";
import Capabilities from "../components/sections/Capabilities";
import Team from "../components/sections/Team";
import FooterCTA from "../components/sections/FooterCTA";

export default function Home({ ready }) {
  return (
    <main className="relative">
      {/* Act one — the hero and the statement share one WebGL layer, so the
          mark that rotates under the headline is the same mark that shatters
          behind the copy. */}
      <div id="act-one" className="relative">
        <HeroCanvas triggerId="act-one" />
        <Hero ready={ready} />
        <About />
      </div>

      <Marquee />
      <KeyFacts />
      <SelectedWork />
      {/* Dark interstitial: breaks up the long light stretch and hands over
          into the services act. */}
      <Statement />
      <ServicesScene />
      {/* The campaign feature and the Branding Series carousel were pulled at
          the client's request. Both components are kept in the tree, unused,
          so either can be dropped back in with one import. */}
      <Capabilities />
      <ClientStories />
      {/* Faces before the ask: the reel closes the light stretch and hands
          back into the dark for the CTA. */}
      <Team />
      <FooterCTA />
    </main>
  );
}
