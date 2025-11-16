import moment from "moment";

export const YEARS = ["2024", "2025"] as const;

export const OPEN_DAYS_FROM_TODAY = 0;

export const SCREENS = {
  INTRO: "INTRO",
  PERIOD_OVERVIEW: "PeriodOverview",
  DAY_OVERVIEW: "DayOverview",
  REGISTER: "Register",
  LOGIN: "Login",
  LOADING: "Loading",
  SUMMARY: "Summary",
  HOME: "Home",
  PLANS: "Plans",
  ALBUM: "Album",
  DASHBOARD: "Dashboard",
  PAYWALL: "Paywall",
} as const;

export const LANGUAGES = {
  ua: { icon: "ua", nativeName: "Українська", moment: "uk" },
  en: { icon: "us", nativeName: "English", moment: "en-gb" },
};

export enum TaskOutputType {
  Text = "text",
  Image = "image",
  List = "list",
  TextPhoto = "textPhoto",
}

export const allMonths = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export const albumScreenmMonthOrder = [...allMonths, "year"] as const;
export const taskMonths = [...allMonths, "every"] as const;

export const TASK_CONTEXT = {
  HEALTH: "health",
  LEARNING: "learning",
  WORK: "work",
  RELATIONSHIP: "relationship",
  RELAX: "relax",
  ART: "art",
  MONEY: "money",
  SUPPORTS: "supports",
  GLOBAL_GOAL: "globalGoal",
  SUPPORT_WORD: "supportWord",
} as const;

export const TASK_CATEGORY = {
  MOOD: "mood",
  SUMMARY: "summary",
  PLANS: "plans",
  MONTH_PHOTO: "monthPhoto",
  GOALS: "goals",
} as const;

export const MAX_PLANS_AMOUNT = 10;

export const months = [
  { short: "Січ", long: "Січень", value: "january" },
  { short: "Лют", long: "Лютий", value: "february" },
  { short: "Бер", long: "Березень", value: "march" },
  { short: "Квіт", long: "Квітень", value: "april" },
  { short: "Трав", long: "Травень", value: "may" },
  { short: "Черв", long: "Червень", value: "june" },
  { short: "Лип", long: "Липень", value: "july" },
  { short: "Серп", long: "Серпень", value: "august" },
  { short: "Вер", long: "Вересень", value: "september" },
  { short: "Жовт", long: "Жовтень", value: "october" },
  { short: "Лист", long: "Листопад", value: "november" },
  { short: "Груд", long: "Грудень", value: "december" },
];

export enum PlansViewOptions {
  context = "context",
  month = "month",
}

// Validation regex patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
