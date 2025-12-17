import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useUnsavedChanges } from "../contexts/UnsavedChangesContext";
import { showUnsavedChangesAlert } from "../utils/unsaved-changes-alert";

export function useUnsavedChangesBlocker(unsavedChanges: boolean) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isUnsavedChanges, setUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    setUnsavedChanges(unsavedChanges);
  }, [unsavedChanges, setUnsavedChanges]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!isUnsavedChanges) {
        return;
      }

      e.preventDefault();

      showUnsavedChangesAlert(t, () => {
        setUnsavedChanges(false);
        navigation.dispatch(e.data.action);
      });
    });

    return unsubscribe;
  }, [navigation, isUnsavedChanges, setUnsavedChanges, t]);
}
