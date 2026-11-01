import { Text } from "@/ui/text";
import { MenuIcon, Icon } from "@/ui/icon";
import { Box } from "@/ui/box";
import { Pressable } from "@/ui/pressable";
import { Menu, MenuItem } from "@/ui/menu";
import { LogOut, Trash2, Crown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { SCREENS } from "@/constants";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Alert } from "react-native";
import { typeRole } from "@/constants/typography";
import { colors } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "../../store/withTypes";
import { clearUser } from "../../store/authReducer";
import {
  useSignOutMutation,
  useDeleteCurrentUserMutation,
} from "../../services/auth-api-rtk";
import { useGetUserProfileQuery } from "../../services/api";
import { RootStackParamList } from "@/navigation/types";
import { resolveErrorMessage } from "@/utils";

const menuSurfaceStyle = {
  borderRadius: 16,
  paddingVertical: 0,
  overflow: "visible" as const,
  shadowColor: "#2B211A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 10,
  elevation: 6,
};

const actionItemClass =
  "min-h-[48px] bg-ivory-card px-4 py-[13px] data-[active=true]:bg-ivory-badge";

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
              dispatch(clearUser());
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

  const actions = [
    {
      key: "subscription",
      textValue: "Subscription",
      label: t("common.manageSubscription"),
      icon: Crown,
      onPress: handleManageSubscription,
    },
    {
      key: "Logout",
      textValue: "Logout",
      label: t("common.logout"),
      icon: LogOut,
      onPress: handleLogout,
    },
    {
      key: "Delete",
      textValue: "Delete",
      label: t("common.deleteAccount"),
      icon: Trash2,
      onPress: handleDeleteAccount,
      destructive: true,
    },
  ];

  return (
    <Box className="pr-4">
      <Menu
        placement="bottom right"
        offset={6}
        style={menuSurfaceStyle}
        trigger={(triggerProps) => (
          <Pressable
            {...triggerProps}
            accessibilityRole="button"
            hitSlop={8}
            delayPressIn={0}
            collapsable={false}
            className="h-10 w-10 items-center justify-center rounded-[14px] border border-ivory-line bg-ivory-card"
          >
            <Icon
              as={MenuIcon}
              className="h-[21px] w-[21px] text-primaryText"
            />
          </Pressable>
        )}
      >
        <MenuItem
          key="welcome"
          textValue="welcome"
          disabled
          className="rounded-b-none rounded-t-2xl border-b-[0.5px] border-ivory-line bg-ivory-card p-0 data-[disabled=true]:opacity-100"
        >
          <Box
            pointerEvents="none"
            className="absolute -top-[5px] right-[18px] h-2.5 w-2.5 bg-ivory-card"
            style={{ transform: [{ rotate: "45deg" }] }}
          />
          <Box className="w-full px-4 py-3">
            <Text className={`${typeRole.supporting} mb-1 text-secondaryText`}>
              {t("common.welcome")}
            </Text>
            <Text className={`${typeRole.button} text-primaryText`}>
              {userProfile?.name || "User"}
            </Text>
          </Box>
        </MenuItem>
        {actions.map((action, index) => {
          const isLast = index === actions.length - 1;
          const color = action.destructive
            ? colors.primary500
            : colors.primaryText;

          return (
            <MenuItem
              key={action.key}
              onPress={action.onPress}
              textValue={action.textValue}
              className={
                isLast
                  ? `${actionItemClass} rounded-b-2xl rounded-t-none`
                  : `${actionItemClass} rounded-none border-b-[0.5px] border-ivory-line`
              }
            >
              <Icon
                as={action.icon}
                size="sm"
                className="mr-3"
                style={{ color }}
              />
              <Text className={typeRole.body} style={{ color }}>
                {action.label}
              </Text>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
