import { albumScreenmMonthOrder } from "../../constants/constants";
import { AlbumScreenMonth, MonthlyData, MonthPhotoData } from "../../types/types";

export const mapDataToCarousel = (inputDict: MonthPhotoData): MonthlyData[] => {
  const outputList = Object.entries(inputDict).reduce<MonthlyData[]>(
    (acc, [month, data]) => {
      if (data) {
        acc.push({
          month: month as AlbumScreenMonth,
          id: data.id,
          image: data.image,
          text: data.text,
        });
      }
      return acc;
    },
    [],
  );

  return outputList.sort(
    (a, b) =>
      albumScreenmMonthOrder.indexOf(a.month) -
      albumScreenmMonthOrder.indexOf(b.month),
  );
};
