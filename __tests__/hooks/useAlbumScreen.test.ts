import { act, renderHook } from "@testing-library/react-native";
import { useAlbumScreen } from "../../screens/album-screen/hooks/useAlbumScreen";
import { createHookWrapper } from "../utils/render";
import { loggedInPreloadedState } from "../utils/day-task-helpers";
import { mockGetUserDataQuery, resetApiHookMocks } from "../mocks/api-hooks";

jest.mock("../../services/api", () => ({
  ...jest.requireActual("../../services/api"),
  useGetUserDataQuery: (...args: unknown[]) => mockGetUserDataQuery(...args),
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

describe("useAlbumScreen", () => {
  beforeEach(() => {
    resetApiHookMocks();
  });

  it("returns null photos when there is no month photo data", () => {
    setUserData(null);
    const { result } = renderHook(() => useAlbumScreen(), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    expect(result.current.photos).toBeNull();
    expect(result.current.currentMonth).toBe("Рік");
  });

  it("maps month photos and sets the current month label", () => {
    setUserData({
      monthPhoto: {
        january: {
          id: "p1",
          text: "Winter",
          image: { id: "img1", uri: "file://jan.jpg" },
        },
        march: {
          id: "p2",
          text: "Spring",
          image: { id: "img2", uri: "file://mar.jpg" },
        },
      },
    });

    const { result } = renderHook(() => useAlbumScreen(), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    expect(result.current.photos).toHaveLength(2);
    expect(result.current.photos?.[0].month).toBe("january");
    expect(result.current.currentMonth).toBe("Січень");
  });

  it("updates the current month when snapping to another slide", () => {
    setUserData({
      monthPhoto: {
        january: {
          id: "p1",
          text: "Winter",
          image: { id: "img1", uri: "file://jan.jpg" },
        },
        march: {
          id: "p2",
          text: "Spring",
          image: { id: "img2", uri: "file://mar.jpg" },
        },
      },
    });

    const { result } = renderHook(() => useAlbumScreen(), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    act(() => {
      result.current.handleSnapToItem(1);
    });

    expect(result.current.currentMonth).toBe("Березень");
  });

  it("delegates carousel navigation to the carousel ref", () => {
    setUserData({
      monthPhoto: {
        january: {
          id: "p1",
          text: "Winter",
          image: { id: "img1", uri: "file://jan.jpg" },
        },
      },
    });

    const { result } = renderHook(() => useAlbumScreen(), {
      wrapper: createHookWrapper(loggedInPreloadedState),
    });

    const next = jest.fn();
    const prev = jest.fn();
    (result.current.carouselRef as { current: unknown }).current = {
      next,
      prev,
    };

    act(() => {
      result.current.handleForward();
      result.current.handleBack();
    });

    expect(next).toHaveBeenCalledTimes(1);
    expect(prev).toHaveBeenCalledTimes(1);
  });
});
