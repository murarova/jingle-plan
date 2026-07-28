import { VStack } from "@/ui/vstack";
import { HStack } from "@/ui/hstack";
import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@/ui/slider";
import { Center } from "@/ui/center";
import { useRating } from "../../../hooks/useRating";

interface HappySliderProps {
  isDisabled: boolean;
  rate: number;
  setRate: (rate: number) => void;
}

export const HappySlider = ({
  isDisabled,
  rate,
  setRate,
}: HappySliderProps) => {
  const getRating = useRating();
  const filledColor = isDisabled ? "#999999" : "#ff9da2";
  const thumbColor = isDisabled ? "#999999" : "#ff656c";

  return (
    <VStack space="2xl" className="mt-4 mb-10">
      <Box>
        <Text className="text-center text-6xl pb-2">
          {getRating(rate)?.icon}
        </Text>
        <Text className="text-center">{getRating(rate)?.text}</Text>
      </Box>
      <HStack space="lg" className="justify-center">
        <Center style={{ width: 320 }}>
          <Slider
            sliderTrackHeight={4}
            value={rate}
            isDisabled={isDisabled}
            className="w-full"
            onChange={(v) => {
              setRate(Math.floor(v));
            }}
          >
            <SliderTrack>
              <SliderFilledTrack style={{ backgroundColor: filledColor }} />
            </SliderTrack>
            <SliderThumb style={{ backgroundColor: thumbColor }} />
          </Slider>
        </Center>
      </HStack>
    </VStack>
  );
};
