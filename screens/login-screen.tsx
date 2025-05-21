import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
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
  Center,
} from "@gluestack-ui/themed";
import { Alert, Keyboard } from "react-native";
import { SCREENS } from "../constants/constants";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { InputIcon } from "@gluestack-ui/themed";
import { Loader } from "../components/common";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signInUserAsync } from "../services/auth-api";
import {
  selectAuthStatus,
  selectCurrentUser,
  selectAuthError,
  isLoggedIn,
} from "../store/authReducer";
import { useAppSelector, useAppDispatch } from "../store/withTypes";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App";

type NavigationProp = StackNavigationProp<RootStackParamList, "Login">;

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const isUserLoggedIn = useAppSelector(isLoggedIn);
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);

  const { t } = useTranslation();
  const nav = useNavigation<NavigationProp>();

  useEffect(() => {
    if (isUserLoggedIn) {
      nav.replace(SCREENS.HOME);
    }
  }, [isUserLoggedIn, nav]);

  const goToRegistration = () => {
    nav.push(SCREENS.REGISTER);
  };
  const handleState = () => setShowPassword((prevState) => !prevState);

  const goToMainFlow = async () => {
    if (email && password) {
      dispatch(signInUserAsync({ email, password }));
    } else {
      Alert.alert(
        t("screens.loginScreen.errorTitle"),
        t("screens.loginScreen.emptyFieldsMessage")
      );
    }
  };

  if (authError) {
    Alert.alert(
      t("screens.loginScreen.errorTitle"),
      t("screens.loginScreen.errorMessage")
    );
  }

  if (authStatus === "pending") {
    return <Loader />;
  }

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
                    autoCapitalize="none"
                    inputMode="email"
                    placeholder={t("screens.loginScreen.emailPlaceholder")}
                  />
                </Input>
              </VStack>
              <VStack space="sm" mb={30}>
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
            <Button
              mb={30}
              size="md"
              variant="solid"
              action="primary"
              isDisabled={!email || !password}
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
