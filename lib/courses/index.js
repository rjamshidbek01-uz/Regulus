// Course registry. English is live; the other courses are built and wired in but hidden.
// A course is visible when it is in COURSES_ENABLED (comma-separated codes, e.g. "ru,de") or when
// the user has role 'admin' (for previewing). Launch a course = add its code to COURSES_ENABLED.
import { EN } from "../curriculum";
import { makeCourse } from "../engine";
import * as ru from "./ru";
import * as de from "./de";
import * as fr from "./fr";
import * as tr from "./tr";
import * as ar from "./ar";
import * as it from "./it";
import { alphabet as abcRu } from "./alphabet-ru";
import { alphabet as abcAr } from "./alphabet-ar";

const make = (cfg) => makeCourse(cfg);
export const COURSES = {
  en: EN,
  ru: make({ code: "ru", name: "Rus tili", into: "Rus tiliga", english: "Russian", native: "Русский", speech: "ru-RU", dir: "ltr", script: "cyrillic", units: ru.units, alphabet: abcRu }),
  de: make({ code: "de", name: "Nemis tili", into: "Nemis tiliga", english: "German", native: "Deutsch", speech: "de-DE", dir: "ltr", script: null, units: de.units }),
  fr: make({ code: "fr", name: "Fransuz tili", into: "Fransuz tiliga", english: "French", native: "Français", speech: "fr-FR", dir: "ltr", script: null, units: fr.units }),
  tr: make({ code: "tr", name: "Turk tili", into: "Turk tiliga", english: "Turkish", native: "Türkçe", speech: "tr-TR", dir: "ltr", script: null, units: tr.units }),
  ar: make({ code: "ar", name: "Arab tili", into: "Arab tiliga", english: "Arabic", native: "العربية", speech: "ar-SA", dir: "rtl", script: "arabic", units: ar.units, alphabet: abcAr }),
  it: make({ code: "it", name: "İtalyan tili", into: "İtalyan tiliga", english: "Italian", native: "Italiano", speech: "it-IT", dir: "ltr", script: null, units: it.units }),
};
export const CODES = Object.keys(COURSES);

const enabled = () => new Set(["en", ...String(process.env.COURSES_ENABLED || "").split(",").map((s) => s.trim()).filter((c) => COURSES[c])]);
export const isLive = (code) => enabled().has(code);
export const canUse = (user, code) => !!COURSES[code] && (isLive(code) || user?.role === "admin");
export const visibleCourses = (user) => CODES.filter((c) => canUse(user, c)).map((c) => COURSES[c]);
// The course a signed-in user is studying (falls back to English if theirs is hidden).
export const courseFor = (user) => COURSES[user && canUse(user, user.course) ? user.course : "en"];
// Small, serialisable description for client components.
export const courseInfo = (c) => ({ code: c.code, name: c.name, native: c.native, speech: c.speech, dir: c.dir, hasAlphabet: !!c.alphabet });
