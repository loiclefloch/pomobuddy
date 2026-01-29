import { FolderOpen, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useSettings } from "../hooks/useSettings";

export function SettingsForm() {
  const {
    settings,
    isLoading,
    error,
    pickStorageFolder,
    changeStorageLocation,
    resetStorageLocation,
  } = useSettings();

  const handleBrowse = async () => {
    const folder = await pickStorageFolder();
    if (folder) {
      await changeStorageLocation(folder);
    }
  };

  const handleReset = async () => {
    await resetStorageLocation();
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg">
          {error}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-cozy-text">Storage Location</h2>
        <p className="text-sm text-cozy-muted">
          Choose where your session data is stored. Use a synced folder (Dropbox, iCloud, Google Drive) for backup.
        </p>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-cozy-bg rounded-lg px-4 py-2 text-sm text-cozy-muted truncate">
            {settings.storagePath || "Default (App Data)"}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBrowse}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FolderOpen className="size-4" />
            )}
            Browse
          </Button>

          {settings.storagePath && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={isLoading}
              title="Reset to default location"
            >
              <RotateCcw className="size-4" />
            </Button>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-cozy-text">Timer Settings</h2>
        <p className="text-sm text-cozy-muted">
          Customize your focus and break durations.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-cozy-muted">Focus Duration</label>
            <div className="bg-cozy-bg rounded-lg px-4 py-2 text-cozy-text">
              {Math.floor(settings.focusDuration / 60)} minutes
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-cozy-muted">Break Duration</label>
            <div className="bg-cozy-bg rounded-lg px-4 py-2 text-cozy-text">
              {Math.floor(settings.breakDuration / 60)} minutes
            </div>
          </div>
        </div>

        <p className="text-xs text-cozy-muted italic">
          Duration editing coming soon.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-cozy-text">Audio & Character</h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between bg-cozy-bg rounded-lg px-4 py-2">
            <span className="text-sm text-cozy-text">Audio Enabled</span>
            <span className="text-sm text-cozy-muted">
              {settings.audioEnabled ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex items-center justify-between bg-cozy-bg rounded-lg px-4 py-2">
            <span className="text-sm text-cozy-text">Character</span>
            <span className="text-sm text-cozy-muted capitalize">
              {settings.character}
            </span>
          </div>
        </div>

        <p className="text-xs text-cozy-muted italic">
          Audio and character settings coming soon.
        </p>
      </section>
    </div>
  );
}
