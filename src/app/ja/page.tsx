import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ja } from "@/data/locales/ja";

export default function JapaneseHome() {
    return (
        <div className="flex flex-col min-h-screen lang-ja">
            <Header data={ja.header} />
            <main className="flex-grow">
                <Hero data={ja.hero} />
                <About data={ja.about} />
                <Services data={ja.services} />
                <Clients data={ja.clients} />
                <Contact data={ja.contact} />
            </main>
            <Footer data={ja.footer} />
        </div>
    );
}
