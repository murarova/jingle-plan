import {
  Menu,
  MenuItem,
  Button,
  Box,
  MenuIcon,
  ButtonIcon,
  Icon,
  Text,
} from "@gluestack-ui/themed";
import { LogOut, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { SCREENS } from "../constants/constants";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Alert } from "react-native";
import { deleteCurrentUserAsync, signOutAsync } from "../services/auth-api";
import { useAppDispatch } from "../store/withTypes";
import { RootStackParamList } from "../App";

export function AppMenu() {
  const { i18n, t } = useTranslation();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  function handleLanguageChanged(lng: string) {
    i18n.changeLanguage(lng);
  }

  async function handleLogout() {
    try {
      await dispatch(signOutAsync()).unwrap();
      nav.navigate(SCREENS.LOADING);
    } catch (error) {
      Alert.alert(
        t("common.error"),
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Увага!",
      "Усі ваші дані буде безповоротно видалено.\n\nВаш обліковий запис буде повністю видалено без можливості відновлення.",
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete"),
          onPress: async () => {
            try {
              await dispatch(deleteCurrentUserAsync()).unwrap();
              nav.navigate(SCREENS.LOADING);
            } catch (error) {
              Alert.alert(
                t("common.error"),
                error instanceof Error ? error.message : "An error occurred"
              );
            }
          },
        },
      ]
    );
  }

  return (
    <Box paddingRight={10}>
      <Menu
        placement="top"
        trigger={({ ...triggerProps }) => {
          return (
            <Button {...triggerProps} variant="link">
              <ButtonIcon color="$warmGray800" as={MenuIcon} size="xl" />
            </Button>
          );
        }}
      >
        // Switching languages will not be a part of v1
        {/* {Object.keys(LANGUAGES).map((lng) => (
        <MenuItem
          key={LANGUAGES[lng].icon}
          onPress={() => handleLanguageChanged(lng)}
          textValue={LANGUAGES[lng].nativeName}
        >
          <Box mr={8}>
            <CountryFlag isoCode={LANGUAGES[lng].icon} size={16} />
          </Box>

          <MenuItemLabel size="sm">{LANGUAGES[lng].nativeName}</MenuItemLabel>
        </MenuItem>
      ))} */}
        <MenuItem key="Logout" onPress={handleLogout} textValue="Logout">
          <Icon as={LogOut} size="sm" mr="$2" />
          <Text>{t("common.logout")}</Text>
        </MenuItem>
        <MenuItem key="Delete" onPress={handleDeleteAccount} textValue="Delete">
          <Icon as={Trash2} size="sm" mr="$2" />
          <Text>{t("common.deleteAccount")}</Text>
        </MenuItem>
      </Menu>
    </Box>
  );
}
