export enum TaskOutputType {
  Text = "text",
  Image = "image",
  List = "list",
  TextPhoto = "textPhoto",
}

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

export enum PlansViewOptions {
  context = "context",
  month = "month",
}
