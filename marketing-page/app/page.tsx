import { Anywhere } from "@/components/Anywhere";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Privacy } from "@/components/Privacy";
import { Requirements } from "@/components/Requirements";
import { Speed } from "@/components/Speed";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Anywhere />
        <HowItWorks />
        <Speed />
        <Privacy />
        <Requirements />
      </main>
      <Footer />
    </>
  );
}
