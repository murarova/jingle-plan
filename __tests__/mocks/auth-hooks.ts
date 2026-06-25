export const mockSignInUserMutation = jest.fn(() => [
  jest.fn(() => ({ unwrap: jest.fn(() => Promise.resolve({ uid: "test-uid" })) })),
  { isLoading: false },
]);

export const mockSendPasswordResetMutation = jest.fn(() => [
  jest.fn(() => ({ unwrap: jest.fn(() => Promise.resolve(null)) })),
  { isLoading: false },
]);

export const mockCreateUserMutation = jest.fn(() => [
  jest.fn(() => ({
    unwrap: jest.fn(() =>
      Promise.resolve({ uid: "new-uid", email: "test@example.com" })
    ),
  })),
  { isLoading: false },
]);
