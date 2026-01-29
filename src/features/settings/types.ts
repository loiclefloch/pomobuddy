export interface AppSettings {
  focusDuration: number;
  breakDuration: number;
  storagePath: string | null;
  audioEnabled: boolean;
  character: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 1500,
  breakDuration: 300,
  storagePath: null,
  audioEnabled: true,
  character: "cat",
};
