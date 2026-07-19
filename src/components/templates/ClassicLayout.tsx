import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export interface ProfileLayoutProps {
    themeConfig: any;
    resolvedLang: string;
    layoutConfig: any;
    headerData: any;
    heroData: any;
    aboutDataFormatted: any;
    servicesDataFormatted: any;
    experienceDataFormatted: any;
    clientsDataFormatted: any;
    contactDataFormatted: any;
    footerDataFormatted: any;
}

export default function ClassicLayout(props: ProfileLayoutProps) {
    const {
        themeConfig, resolvedLang, layoutConfig,
        headerData, heroData, aboutDataFormatted,
        servicesDataFormatted, experienceDataFormatted,
        clientsDataFormatted, contactDataFormatted, footerDataFormatted
    } = props;

    return (
        <ThemeProvider themeConfig={themeConfig} className={`flex flex-col min-h-screen lang-${resolvedLang}`}>
            <Header data={headerData} />
            <main className="flex-grow">
                {layoutConfig.showHero && <Hero data={heroData} />}
                {layoutConfig.showAbout && <About data={aboutDataFormatted} />}
                {layoutConfig.showServices && <Services data={servicesDataFormatted} />}
                {layoutConfig.showExperience && <Experience data={experienceDataFormatted} />}
                {layoutConfig.showClients && <Clients data={clientsDataFormatted} />}
                {layoutConfig.showContact && <Contact data={contactDataFormatted} />}
            </main>
            <Footer data={footerDataFormatted} />
        </ThemeProvider>
    );
}
