import { Catalog } from "./_components/catalog";
import { Agents } from "./_components/agents";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Navbar } from "./_components/navbar";

export default function Home() {
  return (
    <div className="mx-auto max-w-screen-2xl overflow-hidden" id="top">
      <Navbar />
      <main>
        <Header />
        <Catalog />
        <Agents />
      </main>
      <Footer />
    </div>
  );
}
