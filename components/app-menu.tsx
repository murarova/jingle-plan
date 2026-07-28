import { Text } from "@/components/ui/text";
import { MenuIcon, Icon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Menu, MenuItem } from "@/components/ui/menu";
import { LogOut, Trash2, Crown } from "lucide-react-native";
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
    },
  );

  async function handleLogout() {
    try {
      await signOut().unwrap();
      dispatch(clearUser());
      nav.navigate(SCREENS.INTRO);
    } catch (error) {
      Alert.alert(
        t("common.error"),
        error instanceof Error ? error.message : "An error occurred",
      );
    }
  }

  function handleManageSubscription() {
    nav.navigate(SCREENS.PAYWALL as never);
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
      ],
    );
  }

  return (
    <Box className="pr-[10px]">
      <Menu
        placement="top"
        trigger={({ ...triggerProps }) => {
          return (
            <Button {...triggerProps} variant="link">
              <ButtonIcon as={MenuIcon} className="h-6 w-6 text-warmGray-800" />
            </Button>
          );
        }}
      >
        <MenuItem
          key="welcome"
          textValue="welcome"
          disabled
          className="rounded-t-lg p-0"
        >
          <Box
            className="p-3 w-full"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#e7e5e4",
            }}
          >
            <Text className="text-sm text-warmGray-600 mb-1">
              {t("common.welcome")}
            </Text>
            <Text className="text-base font-semibold text-warmGray-800">
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
          key="subscription"
          onPress={handleManageSubscription}
          textValue="Subscription"
          className="p-3 min-h-[48px] active:bg-coolGray-100 hover:bg-coolGray-50"
        >
          <Icon as={Crown} size="sm" className="mr-3 text-amber-500" />
          <Text className="text-base">{t("common.manageSubscription")}</Text>
        </MenuItem>
        <MenuItem
          key="Logout"
          onPress={handleLogout}
          textValue="Logout"
          className="p-3 min-h-[48px] active:bg-coolGray-200 hover:bg-coolGray-100"
        >
          <Icon as={LogOut} size="sm" className="mr-3" />
          <Text className="text-base">{t("common.logout")}</Text>
        </MenuItem>
        <MenuItem
          key="Delete"
          onPress={handleDeleteAccount}
          textValue="Delete"
          className="rounded-b-lg p-3 min-h-[48px] active:bg-red-100 hover:bg-red-50"
        >
          <Icon as={Trash2} size="sm" className="mr-3 text-red-600" />
          <Text className="text-base text-red-600">
            {t("common.deleteAccount")}
          </Text>
        </MenuItem>
      </Menu>
    </Box>
  );
}
