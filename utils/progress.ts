interface TaskProgress {
  dayTaskGrade: number;
  moodTaskGrade: number;
}

export function getProgressBackgroundColor(value: number): string {
  if (value < 30) {
    return "#FF656C";
  }

  if (value < 70) {
    return "#FAC515";
  }

  return "#4bb4ad";
}

export function getProgressColorByValue(value: number): string {
  if (value < 30) {
    return "bg-progressRed";
  } else if (value >= 30 && value < 70) {
    return "bg-progressYellow";
  } else {
    return "bg-green-400";
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
