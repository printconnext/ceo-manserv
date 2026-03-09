import { th } from "./th";
import { en } from "./en";
import { ch } from "./ch";
import { jp } from "./jp";
import { hi } from "./hi";
import { fr } from "./fr";
import { it } from "./it";
import { es } from "./es";
import { de } from "./de";
import { ru } from "./ru";
import { fa } from "./fa";
import { pt } from "./pt";
import { br } from "./br";
import { vi } from "./vi";
import { lo } from "./lo";
import { my } from "./my";
import { ph } from "./ph";
import { id } from "./id";

export const LOCALES: Record<string, any> = {
    th, en, ch, jp, hi, fr, it, es, de, ru, fa, pt, br, vi, lo, my, ph, id
};

export const LANG_NAMES: Record<string, string> = {
    th: "ภาษาไทย",
    en: "English",
    ch: "中文 (Chinese)",
    jp: "日本語 (Japanese)",
    hi: "हिन्दी (Hindi)",
    fr: "Français (French)",
    it: "Italiano (Italian)",
    es: "Español (Spanish)",
    de: "Deutsch (German)",
    ru: "Русский (Russian)",
    fa: "فارسی (Persian)",
    pt: "Português (Portuguese)",
    br: "Português (Brazil)",
    vi: "Tiếng Việt (Vietnamese)",
    lo: "ພາສາລາວ (Lao)",
    my: "မြန်မာภาษา (Burmese)",
    ph: "Filipino",
    id: "Bahasa Indonesia",
};
