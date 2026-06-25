export const signInTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve({ uid: "test-uid", email: "test@example.com" }),
}));

export const sendPasswordResetTrigger = jest.fn(() => ({
  unwrap: () => Promise.resolve(null),
}));

export const createUserTrigger = jest.fn(() => ({
  unwrap: () =>
    Promise.resolve({ uid: "new-uid", email: "test@example.com" }),
}));

export const mockSignInUserMutation = jest.fn(() => [
  signInTrigger,
  { isLoading: false },
]);

export const mockSendPasswordResetMutation = jest.fn(() => [
  sendPasswordResetTrigger,
  { isLoading: false },
]);

export const mockCreateUserMutation = jest.fn(() => [
  createUserTrigger,
  { isLoading: false },
]);

export const resetAuthHookMocks = () => {
  signInTrigger.mockClear();
  sendPasswordResetTrigger.mockClear();
  createUserTrigger.mockClear();
  mockSignInUserMutation.mockClear();
  mockSendPasswordResetMutation.mockClear();
  mockCreateUserMutation.mockClear();
};
