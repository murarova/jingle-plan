import { useCallback, useRef } from "react";
import { Alert, BackHandler, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export function useAndroidExitConfirmation() {
  const { t } = useTranslation();
  const isAlertVisible = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") {
        return;
      }

      const onBackPress = () => {
        if (isAlertVisible.current) {
          return true;
        }

        isAlertVisible.current = true;
        Alert.alert(
          t("messages.exitAppTitle"),
          t("messages.exitAppMessage"),
          [
            {
              text: t("common.cancel"),
              style: "cancel",
              onPress: () => {
                isAlertVisible.current = false;
              },
            },
            {
              text: t("messages.exitAppConfirm"),
              style: "destructive",
              onPress: () => {
                isAlertVisible.current = false;
                BackHandler.exitApp();
              },
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              isAlertVisible.current = false;
            },
          },
        );

        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => {
        isAlertVisible.current = false;
        subscription.remove();
      };
    }, [t]),
  );
}
