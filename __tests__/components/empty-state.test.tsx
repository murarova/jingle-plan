import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { EmptyState } from "../../components/common/empty-state";
import { renderWithProviders } from "../utils/render";

describe("EmptyState", () => {
  it("renders the message", () => {
    renderWithProviders(<EmptyState message="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeTruthy();
  });

  it("hides the Retry button when onRetry is not provided", () => {
    renderWithProviders(<EmptyState message="Nothing here" />);
    expect(screen.queryByText("Retry")).toBeNull();
  });

  it("shows the Retry button and calls onRetry when pressed", () => {
    const onRetry = jest.fn();
    renderWithProviders(
      <EmptyState message="Nothing here" onRetry={onRetry} />
    );
    fireEvent.press(screen.getByText("Retry"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
