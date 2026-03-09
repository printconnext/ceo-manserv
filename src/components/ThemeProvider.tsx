"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

interface ThemeConfig {
    colors?: ThemeColors;
    font?: {
        heading: string;
        body: string;
    };
    borderRadius?: string;
    buttonStyle?: string;
    layout?: {
        showHero?: boolean;
        showVideo?: boolean;
        showTestimonials?: boolean;
        showContact?: boolean;
        showExperience?: boolean;
    };
}

export const defaultTheme: ThemeConfig = {
    colors: {
        primary: "#0F766E", // Teal 700
        secondary: "#1E293B", // Slate 800
        accent: "#F59E0B", // Amber 500
        background: "#FFFFFF",
        text: "#111827", // Gray 900
    },
    font: {
        heading: "var(--font-prompt)",
        body: "var(--font-geist-sans)",
    },
    borderRadius: "12px",
    buttonStyle: "rounded",
    layout: {
        showHero: true,
        showVideo: false,
        showTestimonials: true,
        showContact: true,
        showExperience: true,
    }
};

interface ThemeContextType {
    theme: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType>({ theme: defaultTheme });

export const useTheme = () => useContext(ThemeContext);

export default function ThemeProvider({
    children,
    themeConfig,
    className,
}: {
    children: React.ReactNode;
    themeConfig?: any;
    className?: string;
}) {
    const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);

    useEffect(() => {
        if (themeConfig) {
            // Merge initial theme with default theme
            const mergedTheme = {
                ...defaultTheme,
                ...themeConfig,
                colors: { ...defaultTheme.colors, ...(themeConfig.colors || {}) },
                font: { ...defaultTheme.font, ...(themeConfig.font || {}) },
                layout: { ...defaultTheme.layout, ...(themeConfig.layout || {}) }
            };
            setTheme(mergedTheme);
        }
    }, [themeConfig]);

    // Apply CSS variables to the document
    useEffect(() => {
        if (!theme.colors) return;

        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
        root.style.setProperty('--color-accent', theme.colors.accent);
        root.style.setProperty('--color-bg', theme.colors.background);
        root.style.setProperty('--color-text', theme.colors.text);

        if (theme.font) {
            root.style.setProperty('--font-custom-heading', theme.font.heading);
            root.style.setProperty('--font-custom-body', theme.font.body);
        }

        if (theme.borderRadius) {
            root.style.setProperty('--radius-custom', theme.borderRadius);
        }

    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme }}>
            <div
                className={`theme-wrapper ${theme.font?.body === 'var(--font-sarabun)' ? 'font-sarabun' : 'font-sans'} ${className || ''}`}
                style={{
                    backgroundColor: 'var(--color-bg)',
                    color: 'var(--color-text)',
                    minHeight: '100vh'
                }}
            >
                {children}
            </div>
        </ThemeContext.Provider>
    );
}
