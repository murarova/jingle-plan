import { TFunction } from "i18next";
import { Alert } from "react-native";

let isAlertShown = false;

export function showUnsavedChangesAlert(
  t: TFunction,
  onProceed: () => void
): void {
  if (isAlertShown) {
    return;
  }

  isAlertShown = true;

  Alert.alert(
    t("messages.unsavedChangesTitle"),
    t("messages.unsavedChangesMessage"),
    [
      {
        text: t("common.cancel"),
        style: "cancel",
        onPress: () => {
          isAlertShown = false;
        },
      },
      {
        text: t("common.proceed"),
        style: "destructive",
        onPress: () => {
          isAlertShown = false;
          onProceed();
        },
      },
    ]
  );
}
