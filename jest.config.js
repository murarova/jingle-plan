module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@gluestack-ui/.*|@gluestack-style/.*|@legendapp/.*|react-native-reanimated|@react-native-firebase/.*|@notifee/.*|react-native-fbsdk-next|lucide-react-native|react-native-calendars|react-native-keyboard-aware-scroll-view|i18next|react-i18next|react-redux|@reduxjs/toolkit)",
  ],
  moduleNameMapper: {
    "^@env$": "<rootDir>/__tests__/mocks/env.ts",
  },
  testPathIgnorePatterns: ["/node_modules/", "/firebase/"],
};
