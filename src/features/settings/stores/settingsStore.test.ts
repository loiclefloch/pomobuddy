import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSettingsStore } from "../stores/settingsStore";
import { DEFAULT_SETTINGS } from "../types";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

import { invoke } from "@tauri-apps/api/core";
const mockInvoke = vi.mocked(invoke);

describe("settingsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSettingsStore.setState({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,
    });
  });

  describe("loadSettings", () => {
    it("loads settings from backend", async () => {
      const customSettings = {
        ...DEFAULT_SETTINGS,
        storagePath: "/custom/path",
        character: "owl",
      };
      mockInvoke.mockResolvedValueOnce(customSettings);

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.loadSettings();
      });

      expect(mockInvoke).toHaveBeenCalledWith("get_settings");
      expect(result.current.settings).toEqual(customSettings);
      expect(result.current.isLoading).toBe(false);
    });

    it("handles load errors gracefully", async () => {
      mockInvoke.mockRejectedValueOnce(new Error("Failed to load"));

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.loadSettings();
      });

      expect(result.current.error).toBe("Error: Failed to load");
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("updateSettings", () => {
    it("updates settings in backend", async () => {
      mockInvoke.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.updateSettings({ character: "fox" });
      });

      expect(mockInvoke).toHaveBeenCalledWith("update_settings", {
        settings: { ...DEFAULT_SETTINGS, character: "fox" },
      });
      expect(result.current.settings.character).toBe("fox");
    });

    it("handles update errors gracefully", async () => {
      mockInvoke.mockRejectedValueOnce(new Error("Failed to save"));

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.updateSettings({ character: "fox" });
      });

      expect(result.current.error).toBe("Error: Failed to save");
    });
  });

  describe("pickStorageFolder", () => {
    it("returns selected folder path", async () => {
      mockInvoke.mockResolvedValueOnce("/selected/folder");

      const { result } = renderHook(() => useSettingsStore());

      let folder: string | null = null;
      await act(async () => {
        folder = await result.current.pickStorageFolder();
      });

      expect(mockInvoke).toHaveBeenCalledWith("pick_storage_folder");
      expect(folder).toBe("/selected/folder");
    });

    it("returns null when dialog cancelled", async () => {
      mockInvoke.mockResolvedValueOnce(null);

      const { result } = renderHook(() => useSettingsStore());

      let folder: string | null = "/initial";
      await act(async () => {
        folder = await result.current.pickStorageFolder();
      });

      expect(folder).toBeNull();
    });
  });

  describe("changeStorageLocation", () => {
    it("changes storage location and updates settings", async () => {
      mockInvoke.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.changeStorageLocation("/new/path");
      });

      expect(mockInvoke).toHaveBeenCalledWith("change_storage_location", {
        newPath: "/new/path",
      });
      expect(result.current.settings.storagePath).toBe("/new/path");
    });
  });

  describe("resetStorageLocation", () => {
    it("resets storage location to default", async () => {
      useSettingsStore.setState({
        settings: { ...DEFAULT_SETTINGS, storagePath: "/custom/path" },
        isLoading: false,
        error: null,
      });
      mockInvoke.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.resetStorageLocation();
      });

      expect(mockInvoke).toHaveBeenCalledWith("reset_storage_location");
      expect(result.current.settings.storagePath).toBeNull();
    });
  });
});
