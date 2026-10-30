import { colors } from "@/constants/colors";
import { Box } from "@/ui/box";
import { ChevronDown } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";

interface CategoryToggleProps {
  isExpanded: boolean;
}

export function CategoryToggle({ isExpanded }: CategoryToggleProps) {
  return (
    <Box
      className={`h-8 w-8 items-center justify-center rounded-full ${
        isExpanded ? "bg-[#EAF0DE]" : "border border-ivory-line bg-ivory-card"
      }`}
    >
      {isExpanded ? (
        <Svg width={15.6} height={9} viewBox="0 0 15.6 9" fill="none">
          <Path
            d="M7.8 9C8.10778 8.99119 8.38918 8.87671 8.61781 8.63014L15.301 1.77886C15.4945 1.58513 15.6 1.33855 15.6 1.04795C15.6 0.466732 15.1427 0 14.5623 0C14.2809 0 14.0083 0.114481 13.8061 0.317025L7.80879 6.49022L1.79391 0.317025C1.59166 0.123288 1.32785 0 1.03766 0C0.457272 0 0 0.466732 0 1.04795C0 1.33855 0.105524 1.58513 0.298985 1.77886L6.99098 8.63014C7.22841 8.87671 7.49222 9 7.8 9Z"
            fill="#7EB344"
          />
        </Svg>
      ) : (
        <ChevronDown size={16} color={colors.primaryText} strokeWidth={2.5} />
      )}
    </Box>
  );
}
