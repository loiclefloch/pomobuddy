import { useEffect } from "react";
import { useSettingsStore } from "../stores/settingsStore";

export function useSettings() {
  const {
    settings,
    isLoading,
    error,
    loadSettings,
    updateSettings,
    pickStorageFolder,
    changeStorageLocation,
    resetStorageLocation,
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    pickStorageFolder,
    changeStorageLocation,
    resetStorageLocation,
  };
}
