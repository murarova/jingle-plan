import { mapDataToCarousel } from "../../screens/album-screen/map-data-to-carousel";
import type { MonthPhotoData } from "@/types";

describe("mapDataToCarousel", () => {
  it("returns an empty array for empty input", () => {
    expect(mapDataToCarousel({})).toEqual([]);
  });

  it("maps month entries and sorts by album month order", () => {
    const data: MonthPhotoData = {
      march: {
        id: "m3",
        text: "March photo",
        image: { id: "img3", uri: "file://march.jpg" },
      },
      january: {
        id: "m1",
        text: "January photo",
        image: { id: "img1", uri: "file://jan.jpg" },
      },
    };

    const result = mapDataToCarousel(data);
    expect(result).toHaveLength(2);
    expect(result[0].month).toBe("january");
    expect(result[0].text).toBe("January photo");
    expect(result[1].month).toBe("march");
  });

  it("skips null month entries", () => {
    const data = {
      january: {
        id: "m1",
        text: "Only month",
        image: null,
      },
      february: undefined,
    } as MonthPhotoData;

    expect(mapDataToCarousel(data)).toHaveLength(1);
  });
});
