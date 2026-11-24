import React from "react";
import { Alert, BackHandler, Platform } from "react-native";
import { render, screen } from "@testing-library/react-native";
import { useAndroidExitConfirmation } from "../../screens/period-overview-screen/use-android-exit-confirmation";

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: (effect: () => void | (() => void)) => {
      React.useEffect(() => effect(), [effect]);
    },
  };
});

function HomeProbe() {
  useAndroidExitConfirmation();
  return null;
}

describe("useAndroidExitConfirmation", () => {
  const originalOs = Platform.OS;
  let onBackPress: (() => boolean | null | undefined) | null;
  const remove = jest.fn();

  beforeEach(() => {
    onBackPress = null;
    remove.mockReset();
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "android",
    });
    jest.spyOn(BackHandler, "addEventListener").mockImplementation((event, handler) => {
      if (event === "hardwareBackPress") {
        onBackPress = handler;
      }
      return { remove };
    });
    jest.spyOn(BackHandler, "exitApp").mockImplementation(() => {});
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => originalOs,
    });
    jest.restoreAllMocks();
  });

  function pressBack() {
    expect(onBackPress).toEqual(expect.any(Function));
    return onBackPress?.();
  }

  it("asks before leaving the home screen and stays when cancelled", () => {
    render(<HomeProbe />);

    expect(pressBack()).toBe(true);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Вихід",
      "Ви хочете вийти із застосунку?",
      expect.any(Array),
      expect.objectContaining({ cancelable: true }),
    );
    expect(BackHandler.exitApp).not.toHaveBeenCalled();

    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2] as {
      text: string;
      onPress: () => void;
    }[];
    buttons.find((button) => button.text === "Відмінити")?.onPress();

    (Alert.alert as jest.Mock).mockClear();
    expect(pressBack()).toBe(true);
    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it("exits after confirmation", () => {
    render(<HomeProbe />);
    pressBack();

    const buttons = (Alert.alert as jest.Mock).mock.calls[0][2] as {
      text: string;
      onPress: () => void;
    }[];
    buttons.find((button) => button.text === "Вийти")?.onPress();

    expect(BackHandler.exitApp).toHaveBeenCalledTimes(1);
  });

  it("keeps a single prompt while the confirmation is open", () => {
    render(<HomeProbe />);
    pressBack();
    expect(pressBack()).toBe(true);
    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });

  it("stops handling back when the home screen is no longer focused", () => {
    const view = render(<HomeProbe />);
    view.unmount();
    expect(remove).toHaveBeenCalled();
  });

  it("does not handle the back button on iOS", () => {
    Object.defineProperty(Platform, "OS", {
      configurable: true,
      get: () => "ios",
    });

    render(<HomeProbe />);

    expect(BackHandler.addEventListener).not.toHaveBeenCalled();
    expect(screen.queryByText("Ви хочете вийти із застосунку?")).toBeNull();
  });
});
