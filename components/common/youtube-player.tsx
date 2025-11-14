import { useState, useCallback } from "react";
import YoutubeIframe from "react-native-youtube-iframe";
import { Box } from "@gluestack-ui/themed";
import { AnimatedView } from "./animated-view";
import { Loader } from "./loader";

export function YoutubePlayer({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
      // Alert.alert("video has finished playing!");
    }
  }, []);

  function onReady() {
    setIsLoading(false);
  }

  return (
    <Box flex={1}>
      {true && (
        <Box
          position="absolute"
          top="$0"
          bottom="$0"
          left="$0"
          right="$0"
          zIndex={1}
        >
          <Loader size="large" />
        </Box>
      )}
      <AnimatedView style={{ zIndex: 2 }} show={!isLoading}>
        <YoutubeIframe
          height={250}
          play={playing}
          videoId={videoId}
          onReady={onReady}
          onChangeState={onStateChange}
        />
      </AnimatedView>
    </Box>
  );
}
