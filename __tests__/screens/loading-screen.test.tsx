import React from "react";
import { LoadingScreen } from "../../screens/loading-screen";
import { renderWithProviders } from "../utils/render";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate }),
  };
});

jest.mock("../../hooks/useCalendarDayManager", () => ({
  useCalendarDayManager: () => ({ isLoading: false }),
}));

describe("LoadingScreen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the loader", () => {
    const { toJSON } = renderWithProviders(<LoadingScreen />, {
      withNavigation: false,
    });
    expect(toJSON()).toBeTruthy();
  });
});
