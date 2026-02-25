import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { zh } from "@/data/locales/zh";

export default function ChineseHome() {
    return (
        <div className="flex flex-col min-h-screen lang-zh">
            <Header data={zh.header} />
            <main className="flex-grow">
                <Hero data={zh.hero} />
                <About data={zh.about} />
                <Services data={zh.services} />
                <Clients data={zh.clients} />
                <Contact data={zh.contact} />
            </main>
            <Footer data={zh.footer} />
        </div>
    );
}
