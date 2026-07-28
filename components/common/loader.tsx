import { Box } from "@/components/ui/box";
import { ActivityIndicator } from "react-native";

interface LoaderProps {
  size?: number | "small" | "large";
  absolute?: boolean;
}

export const Loader = ({ size, absolute }: LoaderProps) => {
  const BaseLoader = (
    <Box className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} />
    </Box>
  );

  if (absolute) {
    return (
      <Box
        className="absolute bg-white/50 left-0 right-0 top-0 bottom-0 z-[1]">
        {BaseLoader}
      </Box>
    );
  }

  return BaseLoader;
};
