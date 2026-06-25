import React from "react";
import { screen } from "@testing-library/react-native";
import { ProgressBar } from "../../components/common/progress-bar";
import { renderWithProviders } from "../utils/render";

describe("ProgressBar", () => {
  it("renders the progress percentage", () => {
    renderWithProviders(
      <ProgressBar total={42} t={(key) => key} />
    );
    expect(screen.getByText("42%")).toBeTruthy();
  });

  it("renders the progress label", () => {
    renderWithProviders(
      <ProgressBar total={75} t={(key) => key} />
    );
    expect(screen.getByText("screens.processText")).toBeTruthy();
  });
});
