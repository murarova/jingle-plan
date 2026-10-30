import { colors } from "@/constants/colors";

interface TaskProgress {
  dayTaskGrade: number;
  moodTaskGrade: number;
}

export function getProgressBackgroundColor(value: number): string {
  if (value < 30) {
    return colors.primary500;
  }

  if (value < 70) {
    return colors.progressYellow;
  }

  return colors.green400;
}

export function getProgressColorByValue(value: number): string {
  if (value < 30) {
    return "bg-progressRed";
  } else if (value >= 30 && value < 70) {
    return "bg-progressYellow";
  } else {
    return "bg-progressGreen";
  }
}

export function calculateTotalProgress(progress?: TaskProgress): number {
  if (!progress) {
    return 0;
  }
  const totalProgress = Object.values(progress).reduce((sum, grade) => {
    return sum + grade;
  }, 0);

  return totalProgress;
}
