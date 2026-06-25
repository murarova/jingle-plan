export const mockNavigate = jest.fn();
export const mockReplace = jest.fn();
export const mockPush = jest.fn();
export const mockGoBack = jest.fn();

export const mockNavigationModule = () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      replace: mockReplace,
      push: mockPush,
      goBack: mockGoBack,
    }),
  };
};

export const resetNavigationMocks = () => {
  mockNavigate.mockReset();
  mockReplace.mockReset();
  mockPush.mockReset();
  mockGoBack.mockReset();
};
