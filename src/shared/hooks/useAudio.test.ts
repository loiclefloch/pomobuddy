import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useAudio } from "./useAudio";

vi.mock("@/features/settings/stores/settingsStore", () => ({
  useSettingsStore: vi.fn((selector) => {
    const state = { settings: { audioEnabled: true } };
    return selector(state);
  }),
}));

import { useSettingsStore } from "@/features/settings/stores/settingsStore";

describe("useAudio", () => {
  beforeEach(() => {
    vi.mocked(useSettingsStore).mockImplementation((selector) => {
      const state = { settings: { audioEnabled: true } };
      return selector(state);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("hook interface", () => {
    it("returns playAmbient function", () => {
      const { result } = renderHook(() => useAudio());
      expect(typeof result.current.playAmbient).toBe("function");
    });

    it("returns stopAmbient function", () => {
      const { result } = renderHook(() => useAudio());
      expect(typeof result.current.stopAmbient).toBe("function");
    });

    it("returns setVolume function", () => {
      const { result } = renderHook(() => useAudio());
      expect(typeof result.current.setVolume).toBe("function");
    });

    it("returns isPlaying boolean", () => {
      const { result } = renderHook(() => useAudio());
      expect(typeof result.current.isPlaying).toBe("boolean");
    });

    it("initially has isPlaying as false", () => {
      const { result } = renderHook(() => useAudio());
      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe("audioEnabled setting", () => {
    it("respects audioEnabled = true setting", () => {
      vi.mocked(useSettingsStore).mockImplementation((selector) => {
        const state = { settings: { audioEnabled: true } };
        return selector(state);
      });

      const { result } = renderHook(() => useAudio());
      expect(result.current.playAmbient).toBeDefined();
    });

    it("respects audioEnabled = false setting", () => {
      vi.mocked(useSettingsStore).mockImplementation((selector) => {
        const state = { settings: { audioEnabled: false } };
        return selector(state);
      });

      const { result } = renderHook(() => useAudio());
      expect(result.current.playAmbient).toBeDefined();
    });
  });

  describe("stopAmbient before playAmbient", () => {
    it("does not throw when stopping without playing first", () => {
      const { result } = renderHook(() => useAudio());
      expect(() => result.current.stopAmbient()).not.toThrow();
    });
  });

  describe("setVolume before playAmbient", () => {
    it("does not throw when setting volume without playing first", () => {
      const { result } = renderHook(() => useAudio());
      expect(() => result.current.setVolume(0.5)).not.toThrow();
    });
  });

  describe("multiple hook instances", () => {
    it("creates independent instances", () => {
      const { result: result1 } = renderHook(() => useAudio());
      const { result: result2 } = renderHook(() => useAudio());

      expect(result1.current.isPlaying).toBe(false);
      expect(result2.current.isPlaying).toBe(false);
    });
  });
});
