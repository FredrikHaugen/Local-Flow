import { Anywhere } from "@/components/Anywhere";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MakeItYours } from "@/components/MakeItYours";
import { Privacy } from "@/components/Privacy";
import { Requirements } from "@/components/Requirements";
import { Speed } from "@/components/Speed";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Anywhere />
        <MakeItYours />
        <Speed />
        <Privacy />
        <Requirements />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
