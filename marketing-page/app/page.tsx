import { Audio } from "@/components/Audio";
import { Cleanup } from "@/components/Cleanup";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Install } from "@/components/Install";
import { Intro } from "@/components/Intro";
import { Questions } from "@/components/Questions";
import { Words } from "@/components/Words";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Intro />
        <Cleanup />
        <Words />
        <Questions />
        <Audio />
        <Install />
      </main>
      <Footer />
    </>
  );
}
