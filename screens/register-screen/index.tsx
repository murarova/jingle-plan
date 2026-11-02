import { Text } from "@/ui/text";
import { Pressable } from "@/ui/pressable";
import { Input, InputField, InputSlot, InputIcon } from "@/ui/input";
import { AppButton } from "@/components/common";
import { Box } from "@/ui/box";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
import { SafeAreaView } from "../../components/common/safe-area-view";
import { Alert, Keyboard, TextStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { SCREENS, EMAIL_REGEX, PASSWORD_REGEX, colors } from "@/constants";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { typeRole } from "@/constants/typography";
import { KeyboardAvoidingView } from "@/ui/keyboard-avoiding-view";
import { ScrollView } from "@/ui/scroll-view";
import { useAppDispatch } from "../../store/withTypes";
import { setUser, setAuthError, setAuthLoading } from "../../store/authReducer";
import { useCreateUserMutation } from "../../services/auth-api-rtk";
import { convertToSerializableUser } from "../../types/user";
import { useCreateProfileMutation } from "../../services/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/navigation/types";
import { resolveErrorMessage } from "@/utils";
import { Heading } from "@/ui/heading";

type NavigationProp = StackNavigationProp<RootStackParamList, "Register">;

const captionStyle: TextStyle = {
  fontSize: 14,
  lineHeight: 16,
  fontWeight: "500",
};

export const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nameError, setNameError] = useState("");
  const passwordValueRef = useRef("");
  const repeatPasswordValueRef = useRef("");

  const dispatch = useAppDispatch();
  const [createUser] = useCreateUserMutation();
  const [createProfile] = useCreateProfileMutation();

  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();

  const handleState = () => setShowPassword((prevState) => !prevState);

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

  const validatePassword = (password: string) => {
    if (!PASSWORD_REGEX.test(password)) {
      setPasswordError(t("screens.registerScreen.invalidPassword"));
    } else {
      setPasswordError("");
    }
  };

  const validateName = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError(t("screens.registerScreen.emptyName"));
    } else {
      setNameError("");
    }
  };

  const validatePasswordMatch = (nextPassword: string, nextRepeat: string) => {
    if (!nextPassword || !nextRepeat) {
      setPasswordMatchError("");
      return;
    }
    setPasswordMatchError(
      nextPassword !== nextRepeat
        ? t("screens.registerScreen.passwordMatchError")
        : "",
    );
  };

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const currentPassword = passwordValueRef.current || password;
    const currentRepeat = repeatPasswordValueRef.current || repeatPassword;
    validateEmail(trimmedEmail);
    validatePassword(currentPassword);
    validateName(trimmedName);
    validatePasswordMatch(currentPassword, currentRepeat);
    if (
      !trimmedEmail ||
      !EMAIL_REGEX.test(trimmedEmail) ||
      !PASSWORD_REGEX.test(currentPassword) ||
      currentPassword !== currentRepeat ||
      !trimmedName
    ) {
      return;
    }
    try {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {}
      dispatch(setAuthLoading());
      const user = await createUser({
        email: trimmedEmail,
        password: currentPassword,
      }).unwrap();
      const serializableUser = convertToSerializableUser(user, trimmedName);

      await createProfile({
        uid: user.uid,
        name: trimmedName,
        email: user.email || trimmedEmail,
      }).unwrap();

      dispatch(setUser(serializableUser));
      nav.replace(SCREENS.HOME);
    } catch (error) {
      const message =
        resolveErrorMessage(error) ?? t("errors.generic", "An error occurred");

      dispatch(setAuthError(message));
      Alert.alert(t("common.error"), message);
    }
  };

  const handlePasswordChange = (value: string) => {
    passwordValueRef.current = value;
    setPassword(value);
    validatePassword(value);
    validatePasswordMatch(value, repeatPasswordValueRef.current);
  };

  const handleRepeatPasswordChange = (value: string) => {
    repeatPasswordValueRef.current = value;
    setRepeatPassword(value);
    validatePasswordMatch(passwordValueRef.current, value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
  };

  return (
    <Pressable onPress={Keyboard.dismiss} className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
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
                    {t("screens.registerScreen.title")}
                  </Heading>
                  <Box className="gap-6">
                    <Box className="gap-1">
                      <Text className="text-primaryText" style={captionStyle}>
                        {t("screens.registerScreen.name")}
                      </Text>
                      <Input className="h-11 rounded-lg bg-ivory-card">
                        <InputField
                          value={name}
                          onChangeText={handleNameChange}
                          onBlur={() => validateName(name)}
                          onFocus={() => setNameError("")}
                          inputMode="text"
                          placeholder={t("screens.registerScreen.name")}
                          placeholderTextColor={colors.secondaryText}
                          className="px-4"
                        />
                      </Input>
                      {nameError ? (
                        <Text size="sm" className="text-red-500">
                          {nameError}
                        </Text>
                      ) : null}
                    </Box>
                    <Box className="gap-1">
                      <Text className="text-primaryText" style={captionStyle}>
                        {t("screens.registerScreen.email")}
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
                          placeholder={t("screens.registerScreen.email")}
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
                        {t("screens.registerScreen.password")}
                      </Text>
                      <Input className="h-11 rounded-lg bg-ivory-card">
                        <InputField
                          value={password}
                          type={showPassword ? "text" : "password"}
                          onChangeText={handlePasswordChange}
                          placeholder={t("screens.registerScreen.password")}
                          placeholderTextColor={colors.secondaryText}
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="newPassword"
                          autoComplete="new-password"
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
                      {passwordError ? (
                        <Text size="sm" className="text-red-500">
                          {passwordError}
                        </Text>
                      ) : null}
                    </Box>
                    <Box className="gap-1">
                      <Text className="text-primaryText" style={captionStyle}>
                        {t("screens.registerScreen.repeatPassword")}
                      </Text>
                      <Input className="h-11 rounded-lg bg-ivory-card">
                        <InputField
                          value={repeatPassword}
                          type={showPassword ? "text" : "password"}
                          onChangeText={handleRepeatPasswordChange}
                          placeholder={t(
                            "screens.registerScreen.repeatPassword",
                          )}
                          placeholderTextColor={colors.secondaryText}
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="newPassword"
                          autoComplete="new-password"
                          importantForAutofill="yes"
                          className="px-4"
                        />
                      </Input>
                      {passwordMatchError ? (
                        <Text size="sm" className="text-red-500">
                          {passwordMatchError}
                        </Text>
                      ) : null}
                    </Box>
                    <AppButton
                      label={t("screens.registerScreen.registerBtn")}
                      isDisabled={
                        !email ||
                        !password ||
                        !repeatPassword ||
                        !name.trim() ||
                        !!nameError ||
                        !!emailError ||
                        !!passwordError ||
                        !!passwordMatchError
                      }
                      onPress={handleRegister}
                      className="w-full"
                    />
                  </Box>
                </Box>
              </Box>
              <Box className="items-center gap-3 px-6 py-8">
                <Text style={{ ...captionStyle, color: "#756e63" }}>
                  {t("screens.registerScreen.subtitle")}
                </Text>
                <Pressable
                  onPress={() => {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    } catch {}
                    nav.push(SCREENS.LOGIN);
                  }}
                  accessibilityRole="button"
                >
                  <Text className={`${typeRole.button} text-primaryText`}>
                    {t("screens.registerScreen.loginBtn")}
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
