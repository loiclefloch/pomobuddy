import { describe, it, expect, beforeEach } from "vitest";
import {
  useTimerStore,
  selectIsBreak,
  selectIsFocus,
  selectIsActive,
  selectIsRunning,
} from "./timerStore";

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

  describe("derived selectors", () => {
    describe("selectIsBreak", () => {
      it("returns true when status is break", () => {
        useTimerStore.getState().setStatus("break");
        expect(selectIsBreak(useTimerStore.getState())).toBe(true);
      });

      it("returns false when status is focus", () => {
        useTimerStore.getState().setStatus("focus");
        expect(selectIsBreak(useTimerStore.getState())).toBe(false);
      });

      it("returns false when status is idle", () => {
        expect(selectIsBreak(useTimerStore.getState())).toBe(false);
      });
    });

    describe("selectIsFocus", () => {
      it("returns true when status is focus", () => {
        useTimerStore.getState().setStatus("focus");
        expect(selectIsFocus(useTimerStore.getState())).toBe(true);
      });

      it("returns false when status is break", () => {
        useTimerStore.getState().setStatus("break");
        expect(selectIsFocus(useTimerStore.getState())).toBe(false);
      });
    });

    describe("selectIsActive", () => {
      it("returns true when status is focus", () => {
        useTimerStore.getState().setStatus("focus");
        expect(selectIsActive(useTimerStore.getState())).toBe(true);
      });

      it("returns true when status is break", () => {
        useTimerStore.getState().setStatus("break");
        expect(selectIsActive(useTimerStore.getState())).toBe(true);
      });

      it("returns false when status is idle", () => {
        expect(selectIsActive(useTimerStore.getState())).toBe(false);
      });

      it("returns false when status is paused", () => {
        useTimerStore.getState().setStatus("paused");
        expect(selectIsActive(useTimerStore.getState())).toBe(false);
      });
    });

    describe("selectIsRunning", () => {
      it("returns true when status is focus", () => {
        useTimerStore.getState().setStatus("focus");
        expect(selectIsRunning(useTimerStore.getState())).toBe(true);
      });

      it("returns true when status is break", () => {
        useTimerStore.getState().setStatus("break");
        expect(selectIsRunning(useTimerStore.getState())).toBe(true);
      });

      it("returns true when status is paused", () => {
        useTimerStore.getState().setStatus("paused");
        expect(selectIsRunning(useTimerStore.getState())).toBe(true);
      });

      it("returns false when status is idle", () => {
        expect(selectIsRunning(useTimerStore.getState())).toBe(false);
      });
    });
  });
});
