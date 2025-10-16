import {
  Center,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Box,
  HStack,
  VStack,
} from "@gluestack-ui/themed";
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
  return (
    <VStack space="2xl" mt="$4" mb="$10">
      <Box>
        <Text textAlign="center" fontSize="$6xl" pb="$2">
          {getRating(rate)?.icon}
        </Text>
        <Text textAlign="center">{getRating(rate)?.text}</Text>
      </Box>
      <HStack space="lg">
        <Center w="$80">
          <Slider
            sliderTrackHeight={4}
            value={rate}
            isDisabled={isDisabled}
            onChange={(v) => {
              setRate(Math.floor(v));
            }}
          >
            <SliderTrack>
              <SliderFilledTrack
                bg={isDisabled ? "$warmGray400" : "$primary300"}
              />
            </SliderTrack>
            <SliderThumb bg={isDisabled ? "$warmGray400" : "$primary400"} />
          </Slider>
        </Center>
      </HStack>
    </VStack>
  );
};
