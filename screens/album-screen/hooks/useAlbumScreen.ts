import { useState, useCallback, useMemo, useRef } from "react";
import { LayoutChangeEvent } from "react-native";
import { useTranslation } from "react-i18next";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import { months } from "@/constants";
import { MonthPhotoData } from "@/types";
import { useAppSelector } from "../../../store/withTypes";
import { useGetUserDataQuery } from "../../../services/api";
import { mapDataToCarousel } from "../map-data-to-carousel";

export const useAlbumScreen = () => {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselSize, setCarouselSize] = useState({ width: 0, height: 0 });
  const carouselRef = useRef<ICarouselInstance>(null);

  const { currentUser } = useAppSelector((state) => state.auth);
  const { selectedYear } = useAppSelector((state) => state.app);
  const { data: userData } = useGetUserDataQuery(
    { uid: currentUser?.uid!, year: selectedYear },
    { skip: !currentUser?.uid || !selectedYear },
  );
  const monthPhoto = userData?.monthPhoto as MonthPhotoData | null;

  const photos = useMemo(
    () => (monthPhoto ? mapDataToCarousel(monthPhoto) : null),
    [monthPhoto],
  );

  const currentMonth = useMemo(() => {
    if (!photos?.[activeSlide]?.month) return t("common.year");
    const month = months.find((m) => m.value === photos[activeSlide].month);
    return month?.long || t("common.year");
  }, [photos, activeSlide, t]);

  const handleCarouselLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width <= 0 || height <= 0) return;

    setCarouselSize((prev) =>
      prev.width === width && prev.height === height
        ? prev
        : { width, height },
    );
  }, []);

  const handleForward = useCallback(() => {
    carouselRef.current?.next();
  }, []);

  const handleBack = useCallback(() => {
    carouselRef.current?.prev();
  }, []);

  const handleSnapToItem = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  return {
    carouselRef,
    carouselSize,
    photos,
    currentMonth,
    handleCarouselLayout,
    handleForward,
    handleBack,
    handleSnapToItem,
  };
};
