import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Location from "../Location";

jest.spyOn(window, "alert").mockImplementation(() => {});

describe("Location page", () => {
  it("Displays temperature in rights units when a unit has been changed", () => {
    render(
      <Location data={null} getData={jest.fn()} location={{ pathname: "" }} />
    );
    const temperatureElement = screen.getByText(/°C/gi);
    const arrowButton = screen.queryAllByTestId("arrow")[0];

    fireEvent.click(arrowButton);
    expect(temperatureElement).toContain(/Fahrenheit/i);
  });
});
