import { PlanScreenData, TaskContext } from "@/types";

export interface PlanWithContext extends PlanScreenData {
  context: TaskContext;
}

export type PlansMonthData = Record<string, PlanWithContext[]>;
