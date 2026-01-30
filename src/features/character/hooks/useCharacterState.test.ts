import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCharacterState } from "./useCharacterState";
import { useCharacterStore } from "../stores/characterStore";
import { useTimerStore } from "@/features/timer/stores/timerStore";

vi.mock("../stores/characterStore", () => ({
  useCharacterStore: vi.fn(),
}));

vi.mock("@/features/timer/stores/timerStore", () => ({
  useTimerStore: vi.fn(),
}));

describe("useCharacterState", () => {
  const mockSetCharacter = vi.fn();
  const mockCharacterStore = {
    selectedCharacter: "cat",
    setCharacter: mockSetCharacter,
  };
  const mockTimerStatus = "idle";

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useCharacterStore).mockImplementation((selector) =>
      selector ? selector(mockCharacterStore as never) : mockCharacterStore
    );
    vi.mocked(useTimerStore).mockImplementation((selector) =>
      selector ? selector({ status: mockTimerStatus } as never) : mockTimerStatus
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("state mapping", () => {
    it("returns idle state when timer is idle", () => {
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "idle" } as never) : "idle"
      );
      
      const { result } = renderHook(() => useCharacterState());
      
      expect(result.current.state).toBe("idle");
    });

    it("returns focus state when timer is in focus", () => {
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "focus" } as never) : "focus"
      );
      
      const { result } = renderHook(() => useCharacterState());
      
      expect(result.current.state).toBe("focus");
    });

    it("returns break state when timer is in break", () => {
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "break" } as never) : "break"
      );
      
      const { result } = renderHook(() => useCharacterState());
      
      expect(result.current.state).toBe("break");
    });

    it("returns idle state when timer is paused", () => {
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "paused" } as never) : "paused"
      );
      
      const { result } = renderHook(() => useCharacterState());
      
      expect(result.current.state).toBe("idle");
    });
  });

  describe("character selection", () => {
    it("returns selected character from store", () => {
      const koalaStore = {
        selectedCharacter: "koala",
        setCharacter: mockSetCharacter,
      };
      vi.mocked(useCharacterStore).mockImplementation((selector) =>
        selector ? selector(koalaStore as never) : koalaStore
      );
      
      const { result } = renderHook(() => useCharacterState());
      
      expect(result.current.character).toBe("koala");
    });

    it("provides setCharacter function", () => {
      const { result } = renderHook(() => useCharacterState());
      
      result.current.setCharacter("cow");
      
      expect(mockSetCharacter).toHaveBeenCalledWith("cow");
    });
  });

  describe("celebration", () => {
    it("triggers celebration when transitioning from focus to break", () => {
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "focus" } as never) : "focus"
      );
      const { result, rerender } = renderHook(() => useCharacterState());
      
      expect(result.current.isCelebrating).toBe(false);
      
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "break" } as never) : "break"
      );
      rerender();
      
      expect(result.current.isCelebrating).toBe(true);
      expect(result.current.state).toBe("celebrate");
    });

    it("ends celebration after 2500ms", () => {
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "focus" } as never) : "focus"
      );
      const { result, rerender } = renderHook(() => useCharacterState());
      
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "break" } as never) : "break"
      );
      rerender();
      
      expect(result.current.isCelebrating).toBe(true);
      
      act(() => {
        vi.advanceTimersByTime(2500);
      });
      
      expect(result.current.isCelebrating).toBe(false);
      expect(result.current.state).toBe("break");
    });

    it("does not trigger celebration when going from idle to break", () => {
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "idle" } as never) : "idle"
      );
      const { result, rerender } = renderHook(() => useCharacterState());
      
      vi.mocked(useTimerStore).mockImplementation((selector) =>
        selector ? selector({ status: "break" } as never) : "break"
      );
      rerender();
      
      expect(result.current.isCelebrating).toBe(false);
    });

    it("can trigger celebration manually", () => {
      const { result } = renderHook(() => useCharacterState());
      
      expect(result.current.isCelebrating).toBe(false);
      
      act(() => {
        result.current.triggerCelebration();
      });
      
      expect(result.current.isCelebrating).toBe(true);
      expect(result.current.state).toBe("celebrate");
    });

    it("resets celebration timer if triggered again", () => {
      const { result } = renderHook(() => useCharacterState());
      
      act(() => {
        result.current.triggerCelebration();
      });
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.isCelebrating).toBe(true);
      
      act(() => {
        result.current.triggerCelebration();
      });
      
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      
      expect(result.current.isCelebrating).toBe(true);
      
      act(() => {
        vi.advanceTimersByTime(500);
      });
      
      expect(result.current.isCelebrating).toBe(false);
    });
  });
});
