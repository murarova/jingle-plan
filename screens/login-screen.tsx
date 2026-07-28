import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { ButtonText, Button } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "../components/common/safe-area-view";
import { Alert, Keyboard, Switch } from "react-native";
import { SCREENS, EMAIL_REGEX } from "../constants/constants";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  useSignInUserMutation,
  useSendPasswordResetMutation,
} from "../services/auth-api-rtk";
import { setUser, setAuthError, setAuthLoading } from "../store/authReducer";
import { useAppDispatch } from "../store/withTypes";
import { convertToSerializableUser } from "../types/user";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { resolveErrorMessage } from "../utils/utils";
import {
  saveCredentials,
  loadCredentials,
  clearCredentials,
} from "../services/password-storage";
import * as Haptics from "expo-haptics";

type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const stored = await loadCredentials();
      if (!isMounted || !stored) return;

      setEmail(stored.email);
      setPassword(stored.password);
      setRememberMe(true);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRememberToggle = useCallback((value: boolean) => {
    setRememberMe(value);
    if (!value) {
      clearCredentials();
    }
  }, []);

  const goToMainFlow = async () => {
    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
      dispatch(setAuthLoading());
      const user = await signInUser({ email, password }).unwrap();
      dispatch(setUser(convertToSerializableUser(user)));
      if (rememberMe) {
        await saveCredentials(email, password);
      } else {
        await clearCredentials();
      }
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
        t("screens.loginScreen.resetEmailRequired")
      );
      return;
    }

    if (emailError) {
      Alert.alert(
        t("common.error"),
        t("screens.loginScreen.invalidEmailPrompt")
      );
      return;
    }

    try {
      await sendPasswordReset({ email }).unwrap();
      Alert.alert(
        t("common.done"),
        t("screens.loginScreen.resetSuccess", { email })
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
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
      >
        <SafeAreaView className="flex-1">
          <Box className="flex-col p-[10px] pt-[30px] justify-center">
            <Box className="pb-[10px]">
              <Heading>{t("screens.loginScreen.title")}</Heading>
            </Box>
            <Box className="flex-col items-start mt-[20px] mb-[30px]">
              <Text className="mr-[10px]">{t("screens.loginScreen.noAccount")}</Text>
              <Button
                variant="link"
                onPress={goToRegistration}
              >
                <ButtonText>{t("screens.loginScreen.signUpButton")}</ButtonText>
              </Button>
            </Box>
            <Box>
              <VStack space="sm" className="mb-[30px]">
                <Text>{t("screens.loginScreen.email")}</Text>
                <Input>
                  <InputField
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => validateEmail(email)}
                    onFocus={() => setEmailError("")}
                    autoCapitalize="none"
                    inputMode="email"
                    placeholder={t("screens.loginScreen.emailPlaceholder")}
                  />
                </Input>
                {emailError ? (
                  <Text size="sm" className="text-red-500">
                    {emailError}
                  </Text>
                ) : null}
              </VStack>
              <VStack space="sm" className="mb-[20px]">
                <Text>{t("screens.loginScreen.password")}</Text>
                <Input>
                  <InputField
                    value={password}
                    onChangeText={setPassword}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("screens.loginScreen.passwordPlaceholder")}
                  />
                  <InputSlot onPress={handleState} className="pr-3">
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      className="text-darkBlue-500"
                    />
                  </InputSlot>
                </Input>
              </VStack>
            </Box>
            <Box className="flex-row items-center justify-between mb-[20px]">
              <Text>{t("screens.loginScreen.rememberMe")}</Text>
              <Switch
                testID="remember-me-switch"
                value={rememberMe}
                onValueChange={handleRememberToggle}
              />
            </Box>
            <Button
              variant="link"
              onPress={handlePasswordReset}
              isDisabled={isResetLoading}
              className="self-end mb-[20px]">
              <ButtonText className="text-black">
                {t("screens.loginScreen.forgotPassword")}
              </ButtonText>
            </Button>
            <Button
              variant="default"
              isDisabled={!email || !password || !!emailError}
              onPress={goToMainFlow}
              className="mb-[30px]"
            >
              <ButtonText>{t("screens.loginScreen.loginButton")}</ButtonText>
            </Button>
          </Box>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Pressable>
  );
};
