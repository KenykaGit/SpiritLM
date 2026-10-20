import { Catalog } from "./_components/catalog";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { Navbar } from "./_components/navbar";
import { QuickStart } from "./_components/quick-start";

export default function Home() {
  return (
    <div className="landing-page" id="top">
      <Navbar />
      <main>
        <Header />
        <Catalog />
        <QuickStart />
      </main>
      <Footer />
    </div>
  );
}
