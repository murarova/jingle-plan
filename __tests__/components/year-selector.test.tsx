import React from "react";
import { screen } from "@testing-library/react-native";
import { YearSelector } from "../../components/year-selector";
import { renderWithProviders } from "../utils/render";

describe("YearSelector", () => {
  it("renders the current year when no user is logged in", () => {
    renderWithProviders(<YearSelector />);
    expect(screen.getByText("2025")).toBeTruthy();
  });
});
