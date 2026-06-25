import React from "react";
import { fireEvent, screen } from "@testing-library/react-native";
import { ActionButtons } from "../../components/common/action-buttons";
import { renderWithProviders } from "../utils/render";

describe("ActionButtons", () => {
  it("fires onEdit when edit button is pressed", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    renderWithProviders(
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    );
    fireEvent.press(screen.getByText("Редагувати"));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("fires onDelete when delete button is pressed", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    renderWithProviders(
      <ActionButtons onEdit={onEdit} onDelete={onDelete} />
    );
    fireEvent.press(screen.getByText("Видалити"));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
  });
});
