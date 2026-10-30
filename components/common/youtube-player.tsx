import { Box } from "@/ui/box";
import { useState, useCallback } from "react";
import { type LayoutChangeEvent } from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { AnimatedView } from "./animated-view";
import { Loader } from "./loader";

const VIDEO_RADIUS = 16;

export function YoutubePlayer({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoWidth, setVideoWidth] = useState(0);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  function onReady() {
    setIsLoading(false);
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0 && nextWidth !== videoWidth) {
      setVideoWidth(nextWidth);
    }
  };

  const videoHeight = videoWidth > 0 ? Math.round((videoWidth * 9) / 16) : 0;

  return (
    <Box className="w-full items-center" onLayout={onLayout}>
      {videoHeight > 0 && (
        <Box
          className="overflow-hidden"
          style={{
            width: videoWidth,
            height: videoHeight,
            borderRadius: VIDEO_RADIUS,
          }}
        >
          {isLoading && (
            <Box className="absolute bottom-0 left-0 right-0 top-0 z-1">
              <Loader size="large" />
            </Box>
          )}
          <AnimatedView style={{ zIndex: 2 }} show={!isLoading}>
            <YoutubeIframe
              height={videoHeight}
              width={videoWidth}
              play={playing}
              videoId={videoId}
              onReady={onReady}
              onChangeState={onStateChange}
              viewContainerStyle={{
                alignSelf: "center",
                borderRadius: VIDEO_RADIUS,
                overflow: "hidden",
              }}
              webViewStyle={{ borderRadius: VIDEO_RADIUS, opacity: 0.99 }}
            />
          </AnimatedView>
        </Box>
      )}
    </Box>
  );
}
