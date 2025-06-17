import { PlanContextData, TaskContext, TaskProgress } from "../types/types";

export const calculateTotalData = (taskData: PlanContextData): TaskProgress => {
  const totals = Object.values(taskData).reduce<{
    total: number;
    done: number;
  }>(
    (acc, tasks) => {
      if (!tasks) return acc;

      const doneTasks = tasks.filter((task) => task.isDone).length;
      return {
        total: acc.total + tasks.length,
        done: acc.done + doneTasks,
      };
    },
    { total: 0, done: 0 }
  );

  const donePercentage =
    totals.total > 0
      ? parseFloat(((totals.done / totals.total) * 100).toFixed(0))
      : 0;

  return {
    totalTasks: totals.total,
    doneTasks: totals.done,
    donePercentage,
  };
};

export const calculateContextData = (
  taskData: PlanContextData
): Partial<Record<TaskContext, TaskProgress>> => {
  return Object.entries(taskData).reduce<
    Partial<Record<TaskContext, TaskProgress>>
  >((acc, [context, tasks]) => {
    if (!tasks) return acc;

    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((task) => task.isDone).length;
    const donePercentage =
      totalTasks > 0
        ? parseFloat(((doneTasks / totalTasks) * 100).toFixed(0))
        : 0;

    acc[context as TaskContext] = {
      totalTasks,
      doneTasks,
      donePercentage,
    };

    return acc;
  }, {});
};

export const isDataEmpty = (data: TaskProgress | null): boolean => {
  if (!data) return true;
  return (
    data.totalTasks === 0 && data.doneTasks === 0 && data.donePercentage === 0
  );
};
