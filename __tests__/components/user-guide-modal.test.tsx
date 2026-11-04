import React from "react";
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";
import { UserGuideModal } from "@/components/modals/user-guide";
import { UserGuideProvider, useUserGuide } from "@/providers";
import { clearUser, setUser } from "@/store/authReducer";
import { renderWithProviders } from "../utils/render";

describe("UserGuideModal", () => {
  it("walks through all steps and closes on the last one", () => {
    const onClose = jest.fn();
    renderWithProviders(<UserGuideModal isOpen onClose={onClose} />);

    expect(screen.getByText("1 / 4")).toBeTruthy();
    expect(screen.getByText("Твій рік за 31 день")).toBeTruthy();
    expect(screen.queryByTestId("guide-back")).toBeNull();

    fireEvent.press(screen.getByTestId("guide-next"));
    expect(screen.getByText("2 / 4")).toBeTruthy();
    expect(screen.getByText("Що чекає на тебе?")).toBeTruthy();

    fireEvent.press(screen.getByTestId("guide-back"));
    expect(screen.getByText("1 / 4")).toBeTruthy();

    fireEvent.press(screen.getByTestId("guide-next"));
    fireEvent.press(screen.getByTestId("guide-next"));
    fireEvent.press(screen.getByTestId("guide-next"));
    expect(screen.getByText("4 / 4")).toBeTruthy();
    expect(screen.getByText("Зрозуміло")).toBeTruthy();
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.press(screen.getByTestId("guide-next"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("lets the user skip the guide before the last step", () => {
    const onClose = jest.fn();
    renderWithProviders(<UserGuideModal isOpen onClose={onClose} />);

    fireEvent.press(screen.getByTestId("guide-next"));
    fireEvent.press(screen.getByTestId("guide-skip"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hides skip on the last step", () => {
    renderWithProviders(<UserGuideModal isOpen onClose={jest.fn()} />);

    expect(screen.getByText("Пропустити")).toBeTruthy();
    for (let i = 0; i < 3; i += 1) {
      fireEvent.press(screen.getByTestId("guide-next"));
    }
    expect(screen.queryByTestId("guide-skip")).toBeNull();
  });

  it("renders nothing when closed", () => {
    renderWithProviders(<UserGuideModal isOpen={false} onClose={jest.fn()} />);
    expect(screen.queryByText("1 / 4")).toBeNull();
  });
});

describe("UserGuideProvider", () => {
  const loggedIn = {
    auth: {
      currentUser: null,
      userUid: "user-1",
      isLoggedIn: true,
      status: "succeeded",
      error: null,
    },
  } as never;

  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("does not show the guide for a logged-out user", async () => {
    renderWithProviders(
      <UserGuideProvider>
        <Text>app</Text>
      </UserGuideProvider>,
    );

    await act(async () => {});
    expect(screen.queryByText("1 / 4")).toBeNull();
  });

  it("shows the guide after login and remembers dismissal per user", async () => {
    const { store } = renderWithProviders(
      <UserGuideProvider>
        <Text>app</Text>
      </UserGuideProvider>,
    );

    await act(async () => {});
    expect(screen.queryByText("1 / 4")).toBeNull();

    act(() => {
      store.dispatch(
        setUser({
          uid: "user-1",
          email: "a@b.c",
          emailVerified: true,
          displayName: null,
          phoneNumber: null,
          photoURL: null,
        }),
      );
    });

    await waitFor(() => expect(screen.getByText("1 / 4")).toBeTruthy());

    for (let i = 0; i < 4; i += 1) {
      fireEvent.press(screen.getByTestId("guide-next"));
    }

    await waitFor(() => expect(screen.queryByText("4 / 4")).toBeNull());
    expect(await AsyncStorage.getItem("@user_guide_seen:user-1")).toBe("true");
  });

  it("stays hidden once seen and can be reopened", async () => {
    await AsyncStorage.setItem("@user_guide_seen:user-1", "true");

    function Reopen() {
      const { openGuide } = useUserGuide();
      return <Text onPress={openGuide}>reopen</Text>;
    }

    renderWithProviders(
      <UserGuideProvider>
        <Reopen />
      </UserGuideProvider>,
      { preloadedState: loggedIn },
    );

    await waitFor(() => expect(screen.getByText("reopen")).toBeTruthy());
    await act(async () => {});
    expect(screen.queryByText("1 / 4")).toBeNull();

    fireEvent.press(screen.getByText("reopen"));
    await waitFor(() => expect(screen.getByText("1 / 4")).toBeTruthy());
  });

  it("hides the guide when the user logs out", async () => {
    const { store } = renderWithProviders(
      <UserGuideProvider>
        <Text>app</Text>
      </UserGuideProvider>,
      { preloadedState: loggedIn },
    );

    await waitFor(() => expect(screen.getByText("1 / 4")).toBeTruthy());

    act(() => {
      store.dispatch(clearUser());
    });

    await waitFor(() => expect(screen.queryByText("1 / 4")).toBeNull());
  });
});
