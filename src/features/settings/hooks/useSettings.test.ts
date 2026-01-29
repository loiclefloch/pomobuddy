import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSettings } from "./useSettings";
import { useSettingsStore } from "../stores/settingsStore";
import { DEFAULT_SETTINGS } from "../types";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

import { invoke } from "@tauri-apps/api/core";
const mockInvoke = vi.mocked(invoke);

describe("useSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,
    });
  });

  it("loads settings on mount", async () => {
    const customSettings = { ...DEFAULT_SETTINGS, character: "owl" };
    mockInvoke.mockResolvedValueOnce(customSettings);

    const { result } = renderHook(() => useSettings());

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith("get_settings");
    });
  });

  it("provides settings state", async () => {
    mockInvoke.mockResolvedValueOnce(DEFAULT_SETTINGS);

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
    expect(result.current.error).toBeDefined();
  });

  it("provides update functions", async () => {
    mockInvoke.mockResolvedValueOnce(DEFAULT_SETTINGS);

    const { result } = renderHook(() => useSettings());

    expect(typeof result.current.updateSettings).toBe("function");
    expect(typeof result.current.pickStorageFolder).toBe("function");
    expect(typeof result.current.changeStorageLocation).toBe("function");
    expect(typeof result.current.resetStorageLocation).toBe("function");
  });
});
