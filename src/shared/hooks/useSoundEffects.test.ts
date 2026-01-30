import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useSoundEffects } from "./useSoundEffects";

vi.mock("@/features/settings/stores/settingsStore", () => ({
  useSettingsStore: vi.fn((selector) => {
    const state = { settings: { audioEnabled: true } };
    return selector(state);
  }),
}));

import { useSettingsStore } from "@/features/settings/stores/settingsStore";

describe("useSoundEffects", () => {
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
    it("returns playSessionStart function", () => {
      const { result } = renderHook(() => useSoundEffects());
      expect(typeof result.current.playSessionStart).toBe("function");
    });

    it("returns playSessionComplete function", () => {
      const { result } = renderHook(() => useSoundEffects());
      expect(typeof result.current.playSessionComplete).toBe("function");
    });

    it("returns playBreakComplete function", () => {
      const { result } = renderHook(() => useSoundEffects());
      expect(typeof result.current.playBreakComplete).toBe("function");
    });

    it("returns playCelebration function", () => {
      const { result } = renderHook(() => useSoundEffects());
      expect(typeof result.current.playCelebration).toBe("function");
    });
  });

  describe("audioEnabled setting", () => {
    it("functions are available when audioEnabled is true", () => {
      vi.mocked(useSettingsStore).mockImplementation((selector) => {
        const state = { settings: { audioEnabled: true } };
        return selector(state);
      });

      const { result } = renderHook(() => useSoundEffects());
      expect(result.current.playSessionStart).toBeDefined();
      expect(result.current.playSessionComplete).toBeDefined();
      expect(result.current.playBreakComplete).toBeDefined();
      expect(result.current.playCelebration).toBeDefined();
    });

    it("functions are available when audioEnabled is false", () => {
      vi.mocked(useSettingsStore).mockImplementation((selector) => {
        const state = { settings: { audioEnabled: false } };
        return selector(state);
      });

      const { result } = renderHook(() => useSoundEffects());
      expect(result.current.playSessionStart).toBeDefined();
      expect(result.current.playSessionComplete).toBeDefined();
      expect(result.current.playBreakComplete).toBeDefined();
      expect(result.current.playCelebration).toBeDefined();
    });
  });

  describe("multiple hook instances", () => {
    it("creates independent instances", () => {
      const { result: result1 } = renderHook(() => useSoundEffects());
      const { result: result2 } = renderHook(() => useSoundEffects());

      expect(result1.current.playSessionStart).toBeDefined();
      expect(result2.current.playSessionStart).toBeDefined();
      expect(result1.current.playSessionStart).not.toBe(result2.current.playSessionStart);
    });
  });
});
