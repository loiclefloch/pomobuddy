import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import type { AppSettings } from "../types";
import { DEFAULT_SETTINGS } from "../types";

interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  pickStorageFolder: () => Promise<string | null>;
  changeStorageLocation: (path: string) => Promise<void>;
  resetStorageLocation: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await invoke<AppSettings>("get_settings");
      set({ settings, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  updateSettings: async (updates) => {
    const currentSettings = get().settings;
    const newSettings = { ...currentSettings, ...updates };
    set({ isLoading: true, error: null });
    try {
      await invoke("update_settings", { settings: newSettings });
      set({ settings: newSettings, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  pickStorageFolder: async () => {
    try {
      const folder = await invoke<string | null>("pick_storage_folder");
      return folder;
    } catch (err) {
      set({ error: String(err) });
      return null;
    }
  },

  changeStorageLocation: async (path) => {
    set({ isLoading: true, error: null });
    try {
      await invoke("change_storage_location", { newPath: path });
      const settings = get().settings;
      set({ settings: { ...settings, storagePath: path }, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },

  resetStorageLocation: async () => {
    set({ isLoading: true, error: null });
    try {
      await invoke("reset_storage_location");
      const settings = get().settings;
      set({ settings: { ...settings, storagePath: null }, isLoading: false });
    } catch (err) {
      set({ error: String(err), isLoading: false });
    }
  },
}));
