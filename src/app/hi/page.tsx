import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { hi } from "@/data/locales/hi";

export default function HindiHome() {
    return (
        <div className="flex flex-col min-h-screen lang-hi">
            <Header data={hi.header} />
            <main className="flex-grow">
                <Hero data={hi.hero} />
                <About data={hi.about} />
                <Services data={hi.services} />
                <Clients data={hi.clients} />
                <Contact data={hi.contact} />
            </main>
            <Footer data={hi.footer} />
        </div>
    );
}
