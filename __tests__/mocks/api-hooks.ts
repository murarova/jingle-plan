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

export const mockCreateProfileMutation = jest.fn(() => [
  jest.fn(() => ({ unwrap: jest.fn(() => Promise.resolve(null)) })),
  { isLoading: false },
]);
