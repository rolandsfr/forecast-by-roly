import "@testing-library/jest-dom";
import { screen, render, cleanup, waitFor } from "@testing-library/react";
import Preloader from "../Preloader";

describe("Preloader", () => {
  afterEach(() => {
    cleanup();
  });

  it("Shows preloader upon initial page load", () => {
    render(<Preloader loaded={false} />);
    const preloaderElement = screen.getByTestId("preloader");
    expect(preloaderElement).toBeVisible();
  });

  it("Hides preloader when the 'loaded' prop has been set to true", () => {
    render(<Preloader loaded={true} />);
    const preloaderElement = screen.getByTestId("preloader");

    waitFor(() => {
      expect(preloaderElement).not.toBeVisible();
    });
  });
});
