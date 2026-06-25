import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { AlbumScreen } from "../../screens/album-screen/album-screen";
import { renderWithProviders } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import { mockGetUserDataQuery, resetApiHookMocks } from "../mocks/api-hooks";

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useGetUserDataQuery: (...args: unknown[]) => mockGetUserDataQuery(...args),
}));

jest.mock("react-native-reanimated-carousel", () => {
  const React = require("react");
  const { View } = require("react-native");
  const Carousel = ({
    data,
    renderItem,
  }: {
    data: unknown[];
    renderItem: (args: { item: unknown; index: number }) => React.ReactNode;
  }) => (
    <View testID="album-carousel">
      {data.map((item, index) => (
        <View key={index}>{renderItem({ item, index })}</View>
      ))}
    </View>
  );
  return { __esModule: true, default: Carousel };
});

const mockHandleForward = jest.fn();
const mockHandleBack = jest.fn();

jest.mock("../../screens/album-screen/hooks/useAlbumScreen", () => ({
  useAlbumScreen: () => require("../utils/album-screen-test-state").getAlbumScreenState(),
}));

const setUserData = (data: unknown) => {
  mockGetUserDataQuery.mockReturnValue({
    data,
    isLoading: false,
    isFetching: false,
    error: undefined,
    refetch: jest.fn(),
  });
};

describe("AlbumScreen", () => {
  beforeEach(() => {
    resetApiHookMocks();
    const state = require("../utils/album-screen-test-state");
    state.resetAlbumScreenState();
    state.setAlbumScreenState({
      handleForward: mockHandleForward,
      handleBack: mockHandleBack,
    });
    mockHandleForward.mockClear();
    mockHandleBack.mockClear();
  });

  it("shows the empty screen when there are no photos", () => {
    setUserData(null);
    require("../utils/album-screen-test-state").setAlbumScreenState({
      photos: null,
      currentMonth: "Рік",
      carouselSize: { width: 0, height: 0 },
      handleForward: mockHandleForward,
      handleBack: mockHandleBack,
    });

    renderWithProviders(<AlbumScreen />, {
      preloadedState: loggedInPreloadedState,
    });
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
  });

  describe("with photos", () => {
    beforeEach(() => {
      require("../utils/album-screen-test-state").setAlbumScreenState({
        photos: [
          {
            month: "january",
            id: "p1",
            text: "Winter memories",
            image: { id: "img1", uri: "file://jan.jpg" },
          },
          {
            month: "march",
            id: "p2",
            text: "Spring walk",
            image: { id: "img2", uri: "file://mar.jpg" },
          },
        ],
        currentMonth: "Січень",
        carouselSize: { width: 300, height: 400 },
        handleForward: mockHandleForward,
        handleBack: mockHandleBack,
      });
    });

    it("renders carousel items and the current month label", () => {
      renderWithProviders(<AlbumScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      expect(screen.getByTestId("album-carousel")).toBeTruthy();
      expect(screen.getByText("Winter memories")).toBeTruthy();
      expect(screen.getByText("Січень")).toBeTruthy();
    });

    it("calls navigation handlers when arrows are pressed", () => {
      renderWithProviders(<AlbumScreen />, {
        preloadedState: loggedInPreloadedState,
      });
      const buttons = screen.getAllByRole("button");
      fireEvent.press(buttons[0]);
      fireEvent.press(buttons[buttons.length - 1]);
      expect(mockHandleBack).toHaveBeenCalledTimes(1);
      expect(mockHandleForward).toHaveBeenCalledTimes(1);
    });
  });
});
