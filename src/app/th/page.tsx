import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { th } from "@/data/locales/th";

export default function ThaiHome() {
    return (
        <div className="flex flex-col min-h-screen lang-th">
            <Header data={th.header} />
            <main className="flex-grow">
                <Hero data={th.hero} />
                <About data={th.about} />
                <Services data={th.services} />
                <Clients data={th.clients} />
                <Contact data={th.contact} />
            </main>
            <Footer data={th.footer} />
        </div>
    );
}
