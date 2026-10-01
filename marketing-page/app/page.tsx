import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pipeline } from "@/components/Pipeline";
import { Privacy } from "@/components/Privacy";
import { Requirements } from "@/components/Requirements";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Pipeline />
        <Privacy />
        <Requirements />
      </main>
      <Footer />
    </>
  );
}
