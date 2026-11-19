import React from "react";
import { screen } from "@testing-library/react-native";
import { EmptyScreen } from "../../components/common/empty-screen";
import { renderWithProviders } from "../utils/render";

describe("EmptyScreen", () => {
  it.each([
    [
      "summary",
      "Вміст цієї сторінки з'явиться після виконання завдання з підсумків.",
    ],
    [
      "plans",
      "Вміст цієї сторінки з'явиться після виконання завдань щодо планів.",
    ],
    [
      "album",
      "Вміст цієї сторінки з'явиться після виконання завдань про спогади",
    ],
    [
      "dashboard",
      "Вміст цієї сторінки з'явиться після виконання завдань щодо планів.",
    ],
  ] as const)("explains when %s content will appear", (note, message) => {
    renderWithProviders(<EmptyScreen note={note} />);
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
    expect(screen.getByText(message)).toBeTruthy();
  });
});
