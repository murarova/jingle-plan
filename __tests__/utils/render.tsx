import React, { ReactElement } from "react";
import {
  render,
  RenderOptions,
} from "@testing-library/react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GluestackUIProvider } from "../../ui/gluestack-ui-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createTestStore } from "./test-store";
import type { RootState } from "../../store/store";
import type { AppStore } from "../../store/store";
import { UnsavedChangesProvider } from "@/providers";

const Stack = createStackNavigator();

type RenderWithProvidersOptions = Omit<RenderOptions, "wrapper"> & {
  preloadedState?: Partial<RootState>;
  withNavigation?: boolean;
  withUnsavedChanges?: boolean;
};

function Providers({
  children,
  store,
  withNavigation = false,
  withUnsavedChanges = false,
}: {
  children: React.ReactNode;
  store: AppStore;
  withNavigation?: boolean;
  withUnsavedChanges?: boolean;
}) {
  let content = <>{children}</>;

  if (withNavigation) {
    content = (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Test">{() => <>{children}</>}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  if (withUnsavedChanges) {
    content = <UnsavedChangesProvider>{content}</UnsavedChangesProvider>;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GluestackUIProvider mode="light">{content}</GluestackUIProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    withNavigation = false,
    withUnsavedChanges = false,
    ...renderOptions
  }: RenderWithProvidersOptions = {}
) {
  const store = createTestStore(preloadedState);

  const result = render(ui, {
    wrapper: ({ children }) => (
      <Providers
        store={store}
        withNavigation={withNavigation}
        withUnsavedChanges={withUnsavedChanges}
      >
        {children}
      </Providers>
    ),
    ...renderOptions,
  });

  return { ...result, store };
}

export function createHookWrapper(preloadedState?: Partial<RootState>) {
  const store = createTestStore(preloadedState);

  return function HookWrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <GluestackUIProvider mode="light">{children}</GluestackUIProvider>
        </SafeAreaProvider>
      </Provider>
    );
  };
}
