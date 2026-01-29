import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionButton } from "./ActionButton";

describe("ActionButton", () => {
  const mockHandlers = {
    onStart: vi.fn(),
    onStop: vi.fn(),
    onResume: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("idle state", () => {
    it("shows 'Start Session' button with play icon", () => {
      render(<ActionButton status="idle" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /start session/i });
      expect(button).toBeInTheDocument();
    });

    it("calls onStart when clicked", () => {
      render(<ActionButton status="idle" {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /start session/i }));
      expect(mockHandlers.onStart).toHaveBeenCalledTimes(1);
    });

    it("has cozy-accent background styling", () => {
      render(<ActionButton status="idle" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /start session/i });
      expect(button.className).toMatch(/bg-cozy-accent/);
    });

    it("has full width styling", () => {
      render(<ActionButton status="idle" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /start session/i });
      expect(button.className).toMatch(/w-full/);
    });
  });

  describe("focus state", () => {
    it("shows 'Stop' button", () => {
      render(<ActionButton status="focus" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /stop/i });
      expect(button).toBeInTheDocument();
    });

    it("calls onStop when clicked", () => {
      render(<ActionButton status="focus" {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /stop/i }));
      expect(mockHandlers.onStop).toHaveBeenCalledTimes(1);
    });

    it("has secondary variant styling", () => {
      render(<ActionButton status="focus" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /stop/i });
      expect(button.className).not.toMatch(/bg-cozy-accent/);
    });
  });

  describe("break state", () => {
    it("shows 'Stop' button", () => {
      render(<ActionButton status="break" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /stop/i });
      expect(button).toBeInTheDocument();
    });

    it("calls onStop when clicked", () => {
      render(<ActionButton status="break" {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /stop/i }));
      expect(mockHandlers.onStop).toHaveBeenCalledTimes(1);
    });
  });

  describe("paused state", () => {
    it("shows 'Resume' button", () => {
      render(<ActionButton status="paused" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /resume/i });
      expect(button).toBeInTheDocument();
    });

    it("calls onResume when clicked", () => {
      render(<ActionButton status="paused" {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /resume/i }));
      expect(mockHandlers.onResume).toHaveBeenCalledTimes(1);
    });

    it("has cozy-accent background styling", () => {
      render(<ActionButton status="paused" {...mockHandlers} />);
      const button = screen.getByRole("button", { name: /resume/i });
      expect(button.className).toMatch(/bg-cozy-accent/);
    });
  });

  describe("no confirmation dialogs (UX13)", () => {
    it("starts session immediately without confirmation", () => {
      render(<ActionButton status="idle" {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /start session/i }));
      expect(mockHandlers.onStart).toHaveBeenCalledTimes(1);
    });

    it("stops session immediately without confirmation", () => {
      render(<ActionButton status="focus" {...mockHandlers} />);
      fireEvent.click(screen.getByRole("button", { name: /stop/i }));
      expect(mockHandlers.onStop).toHaveBeenCalledTimes(1);
    });
  });
});
