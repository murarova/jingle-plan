export const YEARS = ["2024", "2025", "2026"] as const;

export const OPEN_DAYS_FROM_TODAY = 0;

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
