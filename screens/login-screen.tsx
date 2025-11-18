import { useNavigation } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  ButtonText,
  Heading,
  Input,
  InputField,
  Pressable,
  SafeAreaView,
  Text,
  VStack,
  Button,
  InputSlot,
} from "@gluestack-ui/themed";
import { Alert, Keyboard, Switch } from "react-native";
import { SCREENS, EMAIL_REGEX } from "../constants/constants";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { InputIcon } from "@gluestack-ui/themed";
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
    <Pressable flex={1} onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView>
        <SafeAreaView>
          <Box p={10} pt={30} row-direction="column" justifyContent="center">
            <Box pb={10}>
              <Heading>{t("screens.loginScreen.title")}</Heading>
            </Box>
            <Box flexDirection="column" alignItems="flex-start" mt={20} mb={30}>
              <Text mr={10}>{t("screens.loginScreen.noAccount")}</Text>
              <Button
                size="md"
                variant="link"
                action="primary"
                onPress={goToRegistration}
              >
                <ButtonText>{t("screens.loginScreen.signUpButton")}</ButtonText>
              </Button>
            </Box>
            <Box>
              <VStack space="sm" mb={30}>
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
                  <Text size="sm" color="$red500">
                    {emailError}
                  </Text>
                ) : null}
              </VStack>
              <VStack space="sm" mb={20}>
                <Text>{t("screens.loginScreen.password")}</Text>
                <Input>
                  <InputField
                    value={password}
                    onChangeText={setPassword}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("screens.loginScreen.passwordPlaceholder")}
                  />
                  <InputSlot pr="$3" onPress={handleState}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      color="$darkBlue500"
                    />
                  </InputSlot>
                </Input>
              </VStack>
            </Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              mb={20}
            >
              <Text>{t("screens.loginScreen.rememberMe")}</Text>
              <Switch
                testID="remember-me-switch"
                value={rememberMe}
                onValueChange={handleRememberToggle}
              />
            </Box>
            <Button
              variant="link"
              alignSelf="flex-end"
              mb={20}
              onPress={handlePasswordReset}
              isDisabled={isResetLoading}
            >
              <ButtonText color="$black">
                {t("screens.loginScreen.forgotPassword")}
              </ButtonText>
            </Button>
            <Button
              mb={30}
              size="md"
              variant="solid"
              action="primary"
              isDisabled={!email || !password || !!emailError}
              onPress={goToMainFlow}
            >
              <ButtonText>{t("screens.loginScreen.loginButton")}</ButtonText>
            </Button>
          </Box>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Pressable>
  );
};
