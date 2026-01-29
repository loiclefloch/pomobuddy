import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";

export async function openWindow(label: string): Promise<void> {
  const window = await WebviewWindow.getByLabel(label);
  if (window) {
    await window.show();
    await window.setFocus();
  }
}

export async function hideCurrentWindow(): Promise<void> {
  const window = getCurrentWindow();
  await window.hide();
}

export async function openMainWindow(): Promise<void> {
  await hideCurrentWindow();
  await openWindow("main");
}

export async function openSettingsWindow(): Promise<void> {
  await hideCurrentWindow();
  await openWindow("settings");
}

export async function quitApp(): Promise<void> {
  await invoke("quit_app");
}
