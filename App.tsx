import "react-native-gesture-handler";
import "./global.css";
import "./i18n/i18n";
import "./navigation/fcm-background";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GluestackUIProvider } from "./ui/gluestack-ui-provider";
import { store } from "./store/store";
import { IAPProvider, UnsavedChangesProvider } from "./providers";
import { RootNavigator } from "./navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider mode="light">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <IAPProvider>
              <UnsavedChangesProvider>
                <BottomSheetModalProvider>
                  <RootNavigator />
                </BottomSheetModalProvider>
              </UnsavedChangesProvider>
            </IAPProvider>
          </Provider>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
