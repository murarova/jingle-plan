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
import { useAppDispatch, useAppSelector } from "../store/withTypes";
import { clearUser } from "../store/authReducer";
import {
  useSignOutMutation,
  useDeleteCurrentUserMutation,
} from "../services/auth-api-rtk";
import { useGetUserProfileQuery } from "../services/api";
import { RootStackParamList } from "../App";
import { resolveErrorMessage } from "../utils/utils";

export function AppMenu() {
  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  const [signOut] = useSignOutMutation();
  const [deleteCurrentUser] = useDeleteCurrentUserMutation();

  const { data: userProfile } = useGetUserProfileQuery(
    { uid: currentUser?.uid! },
    {
      skip: !currentUser?.uid,
    }
  );

  async function handleLogout() {
    try {
      await signOut().unwrap();
      dispatch(clearUser());
      nav.navigate(SCREENS.INTRO);
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
              await deleteCurrentUser().unwrap();
              nav.navigate(SCREENS.INTRO);
            } catch (error) {
              console.log("error", error);
              const message =
                resolveErrorMessage(error) ??
                t("errors.generic", "An error occurred");

              Alert.alert(t("common.error"), message);
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
        <MenuItem
          key="welcome"
          textValue="welcome"
          disabled
          borderTopLeftRadius="$lg"
          borderTopRightRadius="$lg"
        >
          <Box
            padding="$3"
            borderBottomWidth={1}
            borderBottomColor="$warmGray200"
          >
            <Text fontSize="$sm" color="$warmGray600" mb="$1">
              {t("common.welcome")}
            </Text>
            <Text fontSize="$md" fontWeight="$semibold" color="$warmGray800">
              {userProfile?.name || "User"}
            </Text>
          </Box>
        </MenuItem>

        {/* Switching languages will not be a part of v1 */}
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
        <MenuItem
          key="Logout"
          onPress={handleLogout}
          textValue="Logout"
          p="$3"
          minHeight={48}
          sx={{
            ":active": {
              backgroundColor: "$coolGray200",
            },
            ":hover": {
              backgroundColor: "$coolGray100",
            },
          }}
        >
          <Icon as={LogOut} size="sm" mr="$3" />
          <Text fontSize="$md">{t("common.logout")}</Text>
        </MenuItem>
        <MenuItem
          key="Delete"
          onPress={handleDeleteAccount}
          textValue="Delete"
          p="$3"
          minHeight={48}
          borderBottomLeftRadius="$lg"
          borderBottomRightRadius="$lg"
          sx={{
            ":active": {
              backgroundColor: "$red100",
            },
            ":hover": {
              backgroundColor: "$red50",
            },
          }}
        >
          <Icon as={Trash2} size="sm" mr="$3" color="$red600" />
          <Text fontSize="$md" color="$red600">
            {t("common.deleteAccount")}
          </Text>
        </MenuItem>
      </Menu>
    </Box>
  );
}
