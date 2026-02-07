import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { en } from "@/data/locales/en";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header data={en.header} />
      <main className="flex-grow">
        <Hero data={en.hero} />
        <About data={en.about} />
        <Services data={en.services} />
        <Clients data={en.clients} />
        <Contact data={en.contact} />
      </main>
      <Footer data={en.footer} />
    </div>
  );
}
