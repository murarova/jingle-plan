import { PlanContextData, TaskContext, TaskProgress } from "../types/types";

export const calculateTotalData = (taskData: PlanContextData): TaskProgress => {
  const totals = Object.values(taskData).reduce<{
    total: number;
    done: number;
  }>(
    (acc, tasks) => {
      if (!tasks) return acc;

      const doneTasks = tasks.filter((task) => task.isDone).length;

      // Calculate monthly tasks (considering "every" month tasks as 12 per year)
      const monthlyTasks = tasks.reduce((monthlyTotal, task) => {
        if (task.month === "every") {
          return monthlyTotal + 12; // One task per month for the whole year
        }
        return monthlyTotal;
      }, 0);

      const monthlyDoneTasks = tasks.reduce((monthlyDone, task) => {
        if (task.month === "every") {
          const monthlyProgress = (task.monthlyProgress ?? []).reduce(
            (acc, month) => acc + (month.isDone ? 1 : 0),
            0
          );
          return parseFloat((monthlyDone + monthlyProgress).toFixed(0));
        }
        return monthlyDone;
      }, 0);

      return {
        total: acc.total + tasks.length + monthlyTasks,
        done: acc.done + doneTasks + monthlyDoneTasks,
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

    // Calculate total tasks (actual task count)
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter((task) => task.isDone).length;

    // Calculate monthly tasks (considering "every" month tasks as 12 per year)
    const monthlyTasks = tasks.reduce((monthlyTotal, task) => {
      if (task.month === "every") {
        return monthlyTotal + 12; // One task per month for the whole year
      }
      return monthlyTotal;
    }, 0);

    const monthlyDoneTasks = tasks.reduce((monthlyDone, task) => {
      if (task.month === "every") {
        const monthlyProgress = (task.monthlyProgress ?? []).reduce(
          (acc, month) => acc + (month.isDone ? 1 : 0),
          0
        );
        return parseFloat((monthlyDone + monthlyProgress).toFixed(0));
      }
      return monthlyDone;
    }, 0);

    acc[context as TaskContext] = {
      totalTasks: totalTasks + monthlyTasks,
      doneTasks: doneTasks + monthlyDoneTasks,
      donePercentage: parseFloat(
        (
          ((doneTasks + monthlyDoneTasks) / (totalTasks + monthlyTasks)) *
          100
        ).toFixed(0)
      ),
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
