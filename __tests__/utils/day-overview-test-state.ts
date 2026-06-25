let dayOverviewState = {
  dayTasks: null as unknown,
  total: 0,
  error: null as unknown,
  refresh: jest.fn(),
  isLoading: false,
};

export const getDayOverviewState = () => dayOverviewState;

export const setDayOverviewState = (
  partial: Partial<typeof dayOverviewState>
) => {
  dayOverviewState = { ...dayOverviewState, ...partial };
};

export const resetDayOverviewState = () => {
  dayOverviewState = {
    dayTasks: null,
    total: 0,
    error: null,
    refresh: jest.fn(),
    isLoading: false,
  };
};
