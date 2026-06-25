export const mockGetUserDataQuery = jest.fn(() => ({
  data: null,
  isLoading: false,
  isFetching: false,
  error: undefined,
  refetch: jest.fn(),
}));

export const mockGetUserProfileQuery = jest.fn(() => ({
  data: null,
  isLoading: false,
  isFetching: false,
  error: undefined,
  refetch: jest.fn(),
}));

export const mockGetConfigurationQuery = jest.fn(() => ({
  data: null,
  isLoading: false,
  isFetching: false,
  error: undefined,
  refetch: jest.fn(),
}));

export const mockLazyGetUserDataQuery = jest.fn(() => [
  jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve(null)),
  })),
  { isLoading: false },
]);

export const createProfileTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve(null),
}));

export const mockCreateProfileMutation = jest.fn(() => [
  createProfileTrigger,
  { isLoading: false },
]);

export const saveTaskByCategoryTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve(null),
}));

export const mockSaveTaskByCategoryMutation = jest.fn(() => [
  saveTaskByCategoryTrigger,
  { isLoading: false },
]);

export const removeTaskTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve(null),
}));

export const mockRemoveTaskMutation = jest.fn(() => [
  removeTaskTrigger,
  { isLoading: false },
]);

export const saveMoodTaskTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve(null),
}));

export const mockSaveMoodTaskMutation = jest.fn(() => [
  saveMoodTaskTrigger,
  { isLoading: false },
]);

export const deleteImageTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve(null),
}));

export const mockDeleteImageMutation = jest.fn(() => [
  deleteImageTrigger,
  { isLoading: false },
]);

export const saveImageTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve("https://example.com/image.jpg"),
}));

export const mockSaveImageMutation = jest.fn(() => [
  saveImageTrigger,
  { isLoading: false },
]);

export const mockLazyGetImageUrlQuery = jest.fn(() => [
  jest.fn(() => ({
    unwrap: jest.fn(() => Promise.resolve("https://example.com/image.jpg")),
  })),
  { isLoading: false },
]);

export const resetApiHookMocks = () => {
  createProfileTrigger.mockClear();
  saveTaskByCategoryTrigger.mockClear();
  removeTaskTrigger.mockClear();
  saveMoodTaskTrigger.mockClear();
  deleteImageTrigger.mockClear();
  saveImageTrigger.mockClear();
  mockCreateProfileMutation.mockClear();
  mockSaveTaskByCategoryMutation.mockClear();
  mockRemoveTaskMutation.mockClear();
  mockSaveMoodTaskMutation.mockClear();
  mockDeleteImageMutation.mockClear();
  mockSaveImageMutation.mockClear();
  mockGetUserDataQuery.mockClear();
};
