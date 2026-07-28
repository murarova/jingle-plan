import "@testing-library/jest-native/extend-expect";
import "react-native-gesture-handler/jestSetup";

jest.mock("react-native-screens", () =>
  require("react-native-screens/mock")
);

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@react-native-firebase/app", () => ({
  getApp: jest.fn(),
  firebase: { app: jest.fn() },
}));

jest.mock("@react-native-firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}));

jest.mock("@react-native-firebase/database", () => ({
  getDatabase: jest.fn(),
  get: jest.fn(),
  ref: jest.fn(),
  remove: jest.fn(),
  set: jest.fn(),
}));

jest.mock("@react-native-firebase/messaging", () => ({
  getMessaging: jest.fn(() => ({})),
  setBackgroundMessageHandler: jest.fn(),
}));

jest.mock("@react-native-firebase/storage", () => ({
  getStorage: jest.fn(),
  getDownloadURL: jest.fn(),
  putFile: jest.fn(),
  deleteObject: jest.fn(),
  ref: jest.fn(),
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium" },
}));

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

jest.mock("@notifee/react-native", () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(),
    displayNotification: jest.fn(),
    onForegroundEvent: jest.fn(() => jest.fn()),
  },
  AndroidImportance: { DEFAULT: 3 },
}));

jest.mock("react-native-fbsdk-next", () => ({
  Settings: { initializeSDK: jest.fn(), setAdvertiserTrackingEnabled: jest.fn() },
  AppEventsLogger: { logEvent: jest.fn() },
}));

jest.mock("react-native-keyboard-aware-scroll-view", () => {
  const { ScrollView } = require("react-native");
  return {
    KeyboardAwareScrollView: ScrollView,
  };
});

jest.mock("react-native-webview", () => {
  const { View } = require("react-native");
  return { WebView: View, default: View };
});

jest.mock("react-native-youtube-iframe", () => {
  const { View } = require("react-native");
  return { __esModule: true, default: View };
});

jest.mock("nativewind", () => ({
  cssInterop: (component: unknown) => component,
  vars: (value: Record<string, string>) => value,
  useColorScheme: () => ({
    colorScheme: "light",
    setColorScheme: jest.fn(),
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const SafeAreaInsetsContext = React.createContext(inset);
  return {
    SafeAreaProvider: ({ children }: { children: unknown }) =>
      React.createElement(
        SafeAreaInsetsContext.Provider,
        { value: inset },
        children
      ),
    SafeAreaView: View,
    SafeAreaInsetsContext,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
  };
});

jest.mock("./services/password-storage", () => ({
  saveCredentials: jest.fn(() => Promise.resolve()),
  loadCredentials: jest.fn(() => Promise.resolve(null)),
  clearCredentials: jest.fn(() => Promise.resolve()),
}));

jest.mock("./services/storage", () => ({
  getUserFromStorage: jest.fn(() => Promise.resolve(null)),
  saveUserToStorage: jest.fn(() => Promise.resolve()),
  removeUserFromStorage: jest.fn(() => Promise.resolve()),
}));

import "./i18n/i18n";
