
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { OpenSource } from "./OpenSource";
import { CTA } from "./CTA";
import { Footer } from "./Footer";
import AI_CHAT_FEATURES from "./ai_chat_features";

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <AI_CHAT_FEATURES />
        <OpenSource />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
