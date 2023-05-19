import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import Setting from "../Setting";

const settingData = {
  name: "Temeperature",
  type: "temperature",
  units: ["Celcius", "Fahrenheit", "Kelvin"],
  setWeatherPieces: jest.fn(),
  active: "Celcius",
};

describe("Setting", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Changes a unit of measure to the following when an arrow is clicked", () => {
    render(<Setting {...settingData} />);
    const unit = screen.getByText("Celcius");
    const arrow = screen.getByTestId("arrow");

    fireEvent.click(arrow);
    expect(unit).toHaveTextContent("Fahrenheit");
  });

  it("Changes a unit of measure to the very first one when an arrow is clicked and it has been the last unit", () => {
    settingData.active = "Kelvin";
    render(<Setting {...settingData} />);
    const unit = screen.queryByText(/Kelvin/i);
    const arrow = screen.getByTestId("arrow");

    fireEvent.click(arrow);
    expect(unit).toHaveTextContent("Celcius");
  });
});
