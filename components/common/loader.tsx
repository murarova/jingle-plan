import { ActivityIndicator } from "react-native";
import { Box } from "@gluestack-ui/themed";

interface LoaderProps {
  size?: number | "small" | "large";
  absolute?: boolean;
}

export const Loader = ({ size, absolute }: LoaderProps) => {
  const BaseLoader = (
    <Box flex={1} justifyContent="center" alignItems="center">
      <ActivityIndicator size={size} />
    </Box>
  );

  if (absolute) {
    return (
      <Box
        position="absolute"
        backgroundColor="rgba(255, 255, 255, 0.5)"
        left={0}
        right={0}
        top={0}
        bottom={0}
        zIndex={1}
      >
        {BaseLoader}
      </Box>
    );
  }

  return BaseLoader;
};
