import { describe, it, expect, beforeEach } from "vitest";
import { useTimerStore } from "./timerStore";

describe("timerStore", () => {
  beforeEach(() => {
    useTimerStore.getState().reset();
  });

  describe("initial state", () => {
    it("starts with idle status", () => {
      expect(useTimerStore.getState().status).toBe("idle");
    });

    it("starts with 0 remaining seconds", () => {
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });
  });

  describe("setStatus", () => {
    it("updates status to focus", () => {
      useTimerStore.getState().setStatus("focus");
      expect(useTimerStore.getState().status).toBe("focus");
    });

    it("updates status to break", () => {
      useTimerStore.getState().setStatus("break");
      expect(useTimerStore.getState().status).toBe("break");
    });

    it("updates status to paused", () => {
      useTimerStore.getState().setStatus("paused");
      expect(useTimerStore.getState().status).toBe("paused");
    });
  });

  describe("setRemainingSeconds", () => {
    it("sets remaining seconds to positive value", () => {
      useTimerStore.getState().setRemainingSeconds(1500);
      expect(useTimerStore.getState().remainingSeconds).toBe(1500);
    });

    it("clamps negative values to 0", () => {
      useTimerStore.getState().setRemainingSeconds(-10);
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });

    it("allows 0 seconds", () => {
      useTimerStore.getState().setRemainingSeconds(100);
      useTimerStore.getState().setRemainingSeconds(0);
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });
  });

  describe("tick", () => {
    it("decrements remaining seconds by 1", () => {
      useTimerStore.getState().setRemainingSeconds(100);
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().remainingSeconds).toBe(99);
    });

    it("does not go below 0", () => {
      useTimerStore.getState().setRemainingSeconds(0);
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });

    it("decrements from 1 to 0", () => {
      useTimerStore.getState().setRemainingSeconds(1);
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });
  });

  describe("reset", () => {
    it("resets status to idle", () => {
      useTimerStore.getState().setStatus("focus");
      useTimerStore.getState().reset();
      expect(useTimerStore.getState().status).toBe("idle");
    });

    it("resets remaining seconds to 0", () => {
      useTimerStore.getState().setRemainingSeconds(1500);
      useTimerStore.getState().reset();
      expect(useTimerStore.getState().remainingSeconds).toBe(0);
    });

    it("resets both status and seconds together", () => {
      useTimerStore.getState().setStatus("break");
      useTimerStore.getState().setRemainingSeconds(300);
      useTimerStore.getState().reset();

      const state = useTimerStore.getState();
      expect(state.status).toBe("idle");
      expect(state.remainingSeconds).toBe(0);
    });
  });
});
