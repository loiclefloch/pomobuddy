import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrayMenuItems } from "./TrayMenuItems";

describe("TrayMenuItems", () => {
  const mockHandlers = {
    onOpenStats: vi.fn(),
    onOpenAchievements: vi.fn(),
    onOpenSettings: vi.fn(),
    onQuit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all menu items", () => {
    render(<TrayMenuItems {...mockHandlers} />);

    expect(screen.getByText("Stats & History")).toBeInTheDocument();
    expect(screen.getByText("Achievements")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Quit")).toBeInTheDocument();
  });

  it("calls onOpenStats when Stats & History is clicked", () => {
    render(<TrayMenuItems {...mockHandlers} />);

    fireEvent.click(screen.getByText("Stats & History"));
    expect(mockHandlers.onOpenStats).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenAchievements when Achievements is clicked", () => {
    render(<TrayMenuItems {...mockHandlers} />);

    fireEvent.click(screen.getByText("Achievements"));
    expect(mockHandlers.onOpenAchievements).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenSettings when Settings is clicked", () => {
    render(<TrayMenuItems {...mockHandlers} />);

    fireEvent.click(screen.getByText("Settings"));
    expect(mockHandlers.onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("calls onQuit when Quit is clicked", () => {
    render(<TrayMenuItems {...mockHandlers} />);

    fireEvent.click(screen.getByText("Quit"));
    expect(mockHandlers.onQuit).toHaveBeenCalledTimes(1);
  });

  it("renders icons for each menu item", () => {
    render(<TrayMenuItems {...mockHandlers} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(4);
    
    buttons.forEach((button) => {
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("has separator between navigation items and quit", () => {
    const { container } = render(<TrayMenuItems {...mockHandlers} />);
    
    const separators = container.querySelectorAll(".bg-cozy-border");
    expect(separators.length).toBeGreaterThan(0);
  });
});
