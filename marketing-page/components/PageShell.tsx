import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// The frame every page shares: the header (with the current page marked), the page, the footer.
export function PageShell({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <>
      <Header current={path} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
