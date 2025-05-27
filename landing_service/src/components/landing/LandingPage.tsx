
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { OpenSource } from "./OpenSource";
import { CTA } from "./CTA";
import { Footer } from "./Footer";

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <OpenSource />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
