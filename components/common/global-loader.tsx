import { ActivityIndicator } from "react-native";
import { Box } from "@gluestack-ui/themed";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const GlobalLoader = () => {
  // Check if any API query or mutation is pending
  const isApiLoading = useSelector((state: RootState) => {
    const apiState = state.api;
    const authApiState = state.authApi;

    // Check if any queries are pending in main API
    const hasApiQueries = Object.values(apiState.queries).some(
      (query: any) => query?.status === "pending"
    );

    // Check if any mutations are pending in main API
    const hasApiMutations = Object.values(apiState.mutations).some(
      (mutation: any) => mutation?.status === "pending"
    );

    // Check if any queries are pending in auth API
    const hasAuthQueries = Object.values(authApiState.queries).some(
      (query: any) => query?.status === "pending"
    );

    // Check if any mutations are pending in auth API
    const hasAuthMutations = Object.values(authApiState.mutations).some(
      (mutation: any) => mutation?.status === "pending"
    );

    return (
      hasApiQueries || hasApiMutations || hasAuthQueries || hasAuthMutations
    );
  });

  if (!isApiLoading) return null;

  return (
    <Box
      position="absolute"
      backgroundColor="rgba(255, 255, 255, 0.8)"
      left={0}
      right={0}
      top={0}
      bottom={0}
      zIndex={9999}
      justifyContent="center"
      alignItems="center"
    >
      <ActivityIndicator size="large" />
    </Box>
  );
};
