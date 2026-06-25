import React from "react";
import { Loader } from "../../components/common/loader";
import { renderWithProviders } from "../utils/render";

describe("Loader", () => {
  it("renders without crashing", () => {
    const { toJSON } = renderWithProviders(<Loader />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders in absolute mode", () => {
    const { toJSON } = renderWithProviders(<Loader absolute />);
    expect(toJSON()).toBeTruthy();
  });
});
