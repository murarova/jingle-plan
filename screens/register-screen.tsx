import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
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
  InputIcon,
} from "@gluestack-ui/themed";
import { Alert, Keyboard } from "react-native";
import { SCREENS, EMAIL_REGEX, PASSWORD_REGEX } from "../constants/constants";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch } from "../store/withTypes";
import { setUser, setAuthError, setAuthLoading } from "../store/authReducer";
import { useCreateUserMutation } from "../services/auth-api-rtk";
import { convertToSerializableUser } from "../types/user";
import { useCreateProfileMutation } from "../services/api";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";
import { resolveErrorMessage } from "../utils/utils";

type NavigationProp = StackNavigationProp<RootStackParamList, "Register">;

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

  const handleRegister = async () => {
    const trimmedName = name.trim();
    if (
      !emailError &&
      !passwordError &&
      !passwordMatchError &&
      !nameError &&
      email &&
      password &&
      repeatPassword &&
      trimmedName
    ) {
      try {
        dispatch(setAuthLoading());
        const user = await createUser({ email, password }).unwrap();
        const serializableUser = convertToSerializableUser(user, trimmedName);

        // Create profile
        await createProfile({
          uid: user.uid,
          name: trimmedName,
          email: user.email || "",
        }).unwrap();

        dispatch(setUser(serializableUser));
        nav.replace(SCREENS.HOME);
      } catch (error) {
        const message =
          resolveErrorMessage(error) ??
          t("errors.generic", "An error occurred");

        dispatch(setAuthError(message));
        Alert.alert(t("common.error"), message);
      }
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);
    setPasswordMatchError(
      value !== password ? t("screens.registerScreen.passwordMatchError") : ""
    );
  };

  const handleNameChange = (value: string) => {
    setName(value);
    validateName(value);
  };

  return (
    <Pressable flex={1} onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView>
        <SafeAreaView flex={1}>
          <Box p={10}>
            <Box pb={10}>
              <Heading>{t("screens.registerScreen.title")}</Heading>
            </Box>
            <Box flexDirection="row" alignItems="center" mb={30}>
              <Text mr={10}>{t("screens.registerScreen.subtitle")}</Text>
              <Button
                size="md"
                variant="link"
                action="primary"
                onPress={() => nav.push(SCREENS.LOGIN)}
              >
                <ButtonText>{t("screens.registerScreen.loginBtn")}</ButtonText>
              </Button>
            </Box>
            <Box>
              <VStack space="sm" mb={20}>
                <Text>{t("screens.registerScreen.name")}</Text>
                <Input>
                  <InputField
                    value={name}
                    onChangeText={handleNameChange}
                    onBlur={() => validateName(name)}
                    onFocus={() => setNameError("")}
                    inputMode="text"
                    placeholder={t("screens.registerScreen.name")}
                  />
                </Input>
                {nameError ? (
                  <Text size="sm" color="$red500">
                    {nameError}
                  </Text>
                ) : null}
              </VStack>
              <VStack space="sm" mb={20}>
                <Text>{t("screens.registerScreen.email")}</Text>
                <Input>
                  <InputField
                    value={email}
                    onChangeText={setEmail}
                    onBlur={() => validateEmail(email)}
                    onFocus={() => setEmailError("")}
                    autoCapitalize="none"
                    inputMode="text"
                    placeholder={t("screens.registerScreen.email")}
                  />
                </Input>
                {emailError ? (
                  <Text size="sm" color="$red500">
                    {emailError}
                  </Text>
                ) : null}
              </VStack>
              <VStack space="sm" mb={10}>
                <Text>{t("screens.registerScreen.password")}</Text>
                <Input>
                  <InputField
                    value={password}
                    type={showPassword ? "text" : "password"}
                    onChangeText={handlePasswordChange}
                    placeholder={t("screens.registerScreen.password")}
                  />
                  <InputSlot pr="$3" onPress={handleState}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      color="$darkBlue500"
                    />
                  </InputSlot>
                </Input>
                {passwordError ? (
                  <Text size="sm" color="$red500">
                    {passwordError}
                  </Text>
                ) : null}
              </VStack>
              <VStack space="sm" mb={30}>
                <Text>{t("screens.registerScreen.repeatPassword")}</Text>
                <Input>
                  <InputField
                    value={repeatPassword}
                    type={showPassword ? "text" : "password"}
                    onChangeText={handleRepeatPasswordChange}
                    placeholder={t("screens.registerScreen.repeatPassword")}
                  />
                </Input>
                {passwordMatchError ? (
                  <Text size="sm" color="$red500">
                    {passwordMatchError}
                  </Text>
                ) : null}
              </VStack>
            </Box>
            <Button
              mb={30}
              size="md"
              variant="solid"
              action="primary"
              isDisabled={
                !email || !password || !repeatPassword || !name.trim()
              }
              onPress={handleRegister}
            >
              <ButtonText>{t("screens.registerScreen.registerBtn")}</ButtonText>
            </Button>
          </Box>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Pressable>
  );
};
