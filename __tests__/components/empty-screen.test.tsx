import React from "react";
import { screen } from "@testing-library/react-native";
import { EmptyScreen } from "../../components/common/empty-screen";
import { renderWithProviders } from "../utils/render";

describe("EmptyScreen", () => {
  it("explains that content appears after the matching daily tasks", () => {
    renderWithProviders(<EmptyScreen />);
    expect(screen.getByText("Поки що тут нічого немає")).toBeTruthy();
    expect(
      screen.getByText(
        "Вміст цієї сторінки з'явиться після виконання відповідних щоденних завдань.",
      ),
    ).toBeTruthy();
  });
});
