import { useTranslation } from "react-i18next";

export const useRating = () => {
  const { t } = useTranslation();
  function getRating(rate?: number) {
    if (rate === undefined || rate === null) {
      return {
        icon: "🤷‍♂️",
        text: t("rating.notRated"),
      };
    }

    if (rate >= 0 && rate < 20) {
      return {
        icon: "😢",
        text: t("rating.bad"),
      };
    }

    if (rate >= 20 && rate < 40) {
      return {
        icon: "🙁",
        text: t("rating.notVeryGood"),
      };
    }

    if (rate >= 40 && rate < 60) {
      return {
        icon: "😐",
        text: t("rating.normal"),
      };
    }

    if (rate >= 60 && rate < 80) {
      return {
        icon: "🙂",
        text: t("rating.good"),
      };
    }

    if (rate >= 80) {
      return {
        icon: "😁",
        text: t("rating.veryGood"),
      };
    }
  }
  return getRating;
};
