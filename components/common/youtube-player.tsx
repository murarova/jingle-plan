import { Box } from "@/components/ui/box";
import { useState, useCallback } from "react";
import YoutubeIframe from "react-native-youtube-iframe";
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
    <Box className="flex-1">
      {true && (
        <Box className="absolute top-0 bottom-0 left-0 right-0 z-1">
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
