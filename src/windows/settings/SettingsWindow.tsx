import { Settings } from "lucide-react";

export default function SettingsWindow() {
  return (
    <main className="min-h-screen bg-cozy-bg flex flex-col items-center justify-center p-8">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="size-8 text-cozy-muted" />
        <h1 className="text-2xl font-heading text-cozy-text">Settings</h1>
      </div>

      <div className="bg-cozy-surface rounded-lg p-6 max-w-sm w-full">
        <p className="text-cozy-muted text-center">
          Settings coming soon.
        </p>
        <p className="text-cozy-muted text-center text-sm mt-2">
          Timer preferences, notification settings, and more will be available here.
        </p>
      </div>
    </main>
  );
}
