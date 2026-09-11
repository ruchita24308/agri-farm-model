import { en } from "./en";
import { te } from "./te";
import { hi } from "./hi";
import { Language } from "../types";

export const translations: Record<Language, typeof en> = { en, te, hi };

export type TranslationKey = keyof typeof en;