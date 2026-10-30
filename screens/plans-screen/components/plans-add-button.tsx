import { Fab } from "@/ui/fab";
import * as Haptics from "expo-haptics";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

type PlansAddButtonProps = {
  onPress: () => void;
};

export function PlansAddButton({ onPress }: PlansAddButtonProps) {
  return (
    <Fab
      placement="bottom right"
      testID="plans-add-button"
      className="h-[53px] w-[53px] rounded-[17px] bg-primary-500 p-0"
      style={{
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
          console.log("Haptics not available");
        });
        onPress();
      }}
    >
      <Svg width={26.4} height={26.4} viewBox="0 0 22 22" fill="none">
        <G clipPath="url(#add-plan-plus)">
          <Path
            d="M14 3V14M14 14V25M14 14H3M14 14H25"
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </G>
        <Defs>
          <ClipPath id="add-plan-plus">
            <Rect width={22} height={22} fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </Fab>
  );
}
