import { Text } from "@/ui/text";
import { Pressable } from "@/ui/pressable";
import { Input, InputField, InputSlot, InputIcon } from "@/ui/input";
import { Heading } from "@/ui/heading";
import { AppButton } from "@/components/common";
import { Box } from "@/ui/box";
import { useNavigation } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { SafeAreaView } from "../../components/common/safe-area-view";
import { Alert, Keyboard, Platform, TextStyle } from "react-native";
import { SCREENS, EMAIL_REGEX, colors } from "@/constants";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { KeyboardAvoidingView } from "@/ui/keyboard-avoiding-view";
import { ScrollView } from "@/ui/scroll-view";
import { typeRole } from "@/constants/typography";
import {
  useSignInUserMutation,
  useSendPasswordResetMutation,
} from "../../services/auth-api-rtk";
import { setUser, setAuthError, setAuthLoading } from "../../store/authReducer";
import { useAppDispatch } from "../../store/withTypes";
import { convertToSerializableUser } from "../../types/user";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/navigation/types";
import { resolveErrorMessage } from "@/utils";
import * as Haptics from "expo-haptics";

type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const MUTED = "#756e63";

const captionStyle: TextStyle = {
  fontSize: 14,
  lineHeight: 16,
  fontWeight: "500",
};

const mutedCaptionStyle: TextStyle = {
  ...captionStyle,
  color: MUTED,
};

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const dispatch = useAppDispatch();
  const [signInUser] = useSignInUserMutation();
  const [sendPasswordReset, { isLoading: isResetLoading }] =
    useSendPasswordResetMutation();

  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError(t("screens.registerScreen.invalidEmail"));
    } else {
      setEmailError("");
    }
  };

  const goToRegistration = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    nav.push(SCREENS.REGISTER);
  };
  const handleState = () => setShowPassword((prevState) => !prevState);

  const goToMainFlow = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    try {
      dispatch(setAuthLoading());
      const user = await signInUser({ email, password }).unwrap();
      dispatch(setUser(convertToSerializableUser(user)));
      nav.replace(SCREENS.HOME);
    } catch (error) {
      const message =
        resolveErrorMessage(error) ?? t("errors.generic", "An error occurred");

      dispatch(setAuthError(message));
      Alert.alert(t("common.error"), message);
    }
  };

  const handlePasswordReset = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (!email) {
      Alert.alert(
        t("common.error"),
        t("screens.loginScreen.resetEmailRequired"),
      );
      return;
    }

    if (emailError) {
      Alert.alert(
        t("common.error"),
        t("screens.loginScreen.invalidEmailPrompt"),
      );
      return;
    }

    try {
      await sendPasswordReset({ email }).unwrap();
      Alert.alert(
        t("common.done"),
        t("screens.loginScreen.resetSuccess", { email }),
      );
    } catch (error) {
      let message =
        resolveErrorMessage(error) ?? t("errors.generic", "An error occurred");

      if (message === "AUTH_EMAIL_NOT_FOUND") {
        message = t("screens.loginScreen.resetEmailNotFound");
      }

      Alert.alert(t("common.error"), message);
    }
  }, [email, emailError, sendPasswordReset, t]);

  return (
    <Pressable onPress={Keyboard.dismiss} className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <SafeAreaView className="flex-1">
            <Box className="flex-1 justify-between">
              <Box className="w-full px-6 pt-10">
                <Heading
                  size="2xl"
                  className="w-full text-center text-primaryText"
                >
                  {t("screens.intro.brand")}
                </Heading>
                <Box className="gap-8 pt-[72px]">
                  <Heading size="lg" className="text-primaryText">
                    {t("screens.loginScreen.title")}
                  </Heading>
                  <Box className="gap-6">
                    <Box className="gap-1">
                      <Text className="text-primaryText" style={captionStyle}>
                        {t("screens.loginScreen.email")}
                      </Text>
                      <Input className="h-11 rounded-lg bg-ivory-card">
                        <InputField
                          value={email}
                          onChangeText={setEmail}
                          onBlur={() => validateEmail(email)}
                          onFocus={() => setEmailError("")}
                          autoCapitalize="none"
                          inputMode="email"
                          textContentType="username"
                          autoComplete="username"
                          importantForAutofill="yes"
                          placeholder={t(
                            "screens.loginScreen.emailPlaceholder",
                          )}
                          placeholderTextColor={colors.secondaryText}
                          className="px-4"
                        />
                      </Input>
                      {emailError ? (
                        <Text size="sm" className="text-red-500">
                          {emailError}
                        </Text>
                      ) : null}
                    </Box>
                    <Box className="gap-1">
                      <Text className="text-primaryText" style={captionStyle}>
                        {t("screens.loginScreen.password")}
                      </Text>
                      <Input className="h-11 rounded-lg bg-ivory-card">
                        <InputField
                          value={password}
                          onChangeText={setPassword}
                          type={showPassword ? "text" : "password"}
                          placeholder={t(
                            "screens.loginScreen.passwordPlaceholder",
                          )}
                          placeholderTextColor={colors.secondaryText}
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="password"
                          autoComplete="password"
                          importantForAutofill="yes"
                          className="px-4"
                        />
                        <InputSlot onPress={handleState} className="pr-4">
                          <InputIcon
                            as={showPassword ? EyeIcon : EyeOffIcon}
                            className="text-[#756e63]"
                          />
                        </InputSlot>
                      </Input>
                    </Box>
                    <Pressable
                      onPress={handlePasswordReset}
                      disabled={isResetLoading}
                      className="h-8 items-end justify-center"
                      accessibilityRole="button"
                    >
                      <Text style={mutedCaptionStyle}>
                        {t("screens.loginScreen.forgotPassword")}
                      </Text>
                    </Pressable>
                    <AppButton
                      label={t("screens.loginScreen.loginButton")}
                      isDisabled={!email || !password || !!emailError}
                      onPress={goToMainFlow}
                      className="w-full"
                    />
                  </Box>
                </Box>
              </Box>
              <Box className="items-center gap-3 px-6 py-8">
                <Text style={mutedCaptionStyle}>
                  {t("screens.loginScreen.noAccount")}
                </Text>
                <Pressable
                  onPress={goToRegistration}
                  accessibilityRole="button"
                >
                  <Text className={`${typeRole.button} text-primaryText`}>
                    {t("screens.loginScreen.signUpButton")}
                  </Text>
                </Pressable>
              </Box>
            </Box>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Pressable>
  );
};
