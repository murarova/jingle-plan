import { Box } from "@/ui/box";
import { ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const GlobalLoader = () => {
  const isApiLoading = useSelector((state: RootState) => {
    const apiState = state.api;
    const authApiState = state.authApi;
    const selectedYear = state.app.selectedYear;

    const hasApiQueries = Object.values(apiState.queries).some((query: any) => {
      if (query?.status !== "pending") {
        return false;
      }
      if (query?.data) {
        return false;
      }
      if (
        query?.endpointName === "getUserData" &&
        query?.originalArgs?.year &&
        query.originalArgs.year !== selectedYear
      ) {
        return false;
      }
      return true;
    });

    // Check if any mutations are pending in main API
    const hasApiMutations = Object.values(apiState.mutations).some(
      (mutation: any) => mutation?.status === "pending"
    );

    // Check if any queries are pending in auth API (exclude refetches that have data)
    const hasAuthQueries = Object.values(authApiState.queries).some(
      (query: any) => {
        // Only show loader for initial fetches, not refetches (if data exists, it's a refetch)
        if (query?.status === "pending" && query?.data) {
          return false;
        }
        return query?.status === "pending";
      }
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
      className="absolute bg-white/80 left-0 right-0 top-0 bottom-0 z-[9999] justify-center items-center">
      <ActivityIndicator size="large" />
    </Box>
  );
};
