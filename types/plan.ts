import { TextData, TaskContext } from "./task";

export interface EveryMonthProgress {
  month: string;
  isDone: boolean;
}

export interface PlanData extends TextData {
  isDone: boolean;
  monthlyProgress?: EveryMonthProgress[];
  month?: string;
}

export interface PlanScreenData extends PlanData {
  context: TaskContext;
}

export type PlansCollection = {
  [key in TaskContext]?: PlanScreenData[];
};

export type SummaryCollection = {
  [key in TaskContext]?: PlanScreenData[];
};

export interface SummaryData extends TextData {
  rate: number;
}

export type PlanContextData = { [context: string]: PlanData[] | undefined };
export type SummaryContextData = { [context: string]: SummaryData | undefined };
