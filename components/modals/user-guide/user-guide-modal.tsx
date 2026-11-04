import { useState } from "react";
import { ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";
import { Modal, ModalBackdrop, ModalContent } from "@/ui/modal";
import { Box } from "@/ui/box";
import { Text } from "@/ui/text";
import { Pressable } from "@/ui/pressable";
import { AppButton } from "@/components/common";
import { colors } from "@/constants/colors";
import { cardShadow } from "@/constants/shadow";
import { typeRole } from "@/constants/typography";
import { GUIDE_STEPS } from "./guide-steps";

const SCREEN_MARGIN = 16;
const INACTIVE_DOT = "#D8D1C3";

type UserGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function GuideDots({ activeIndex }: { activeIndex: number }) {
  return (
    <Box
      className="flex-row items-center justify-center gap-2"
      testID="guide-pagination"
    >
      {GUIDE_STEPS.map((_, index) => {
        const isActive = index === activeIndex;

        return (
          <Box
            key={index}
            className={
              isActive
                ? "h-[7px] w-6 rounded-full"
                : "h-[7px] w-[7px] rounded-full"
            }
            style={{
              backgroundColor: isActive ? colors.green400 : INACTIVE_DOT,
            }}
          />
        );
      })}
    </Box>
  );
}

function GuideContent({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [stepIndex, setStepIndex] = useState(0);
  const total = GUIDE_STEPS.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;
  const Step = GUIDE_STEPS[stepIndex];

  function handleNext() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    if (isLast) {
      onClose();
      return;
    }
    setStepIndex((prev) => prev + 1);
  }

  function handleBack() {
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  return (
    <Box className="flex-1">
      <Box className="min-h-[44px] flex-row items-center justify-between px-5 pb-2 pt-5">
        {isLast ? (
          <Box />
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            hitSlop={10}
            testID="guide-skip"
          >
            <Text className={`${typeRole.secondary} text-secondaryText`}>
              {t("guide.skip")}
            </Text>
          </Pressable>
        )}
        <Text
          className={`${typeRole.secondary} text-secondaryText`}
          testID="guide-counter"
        >
          {`${stepIndex + 1} / ${total}`}
        </Text>
      </Box>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={stepIndex}
          entering={FadeIn.duration(220)}
          style={{ width: "100%" }}
        >
          <Step />
        </Animated.View>
      </ScrollView>
      <Box className="gap-4 px-5 pb-5 pt-2">
        <GuideDots activeIndex={stepIndex} />
        <Box className="flex-row gap-3">
          {!isFirst && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("common.back")}
              onPress={handleBack}
              testID="guide-back"
              className="h-[42px] w-[52px] items-center justify-center rounded-[14px] border border-ivory-line bg-[#f4f0e8]"
            >
              <ArrowLeft size={20} color={colors.primaryText} />
            </Pressable>
          )}
          <AppButton
            label={isLast ? t("guide.finish") : t("guide.next")}
            onPress={handleNext}
            className="flex-1"
            testID="guide-next"
          />
        </Box>
      </Box>
    </Box>
  );
}

export function UserGuideModal({ isOpen, onClose }: UserGuideModalProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const contentWidth = width - SCREEN_MARGIN * 2;
  const contentHeight = height - insets.top - insets.bottom - SCREEN_MARGIN * 2;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalBackdrop />
      <ModalContent
        className="rounded-3xl border border-ivory-line bg-ivory-page"
        style={[
          cardShadow,
          {
            width: contentWidth,
            height: contentHeight,
          },
        ]}
      >
        <GuideContent onClose={onClose} />
      </ModalContent>
    </Modal>
  );
}
