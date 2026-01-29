import { Settings } from "lucide-react";
import { SettingsForm } from "@/features/settings/components";

export default function SettingsWindow() {
  return (
    <main className="min-h-screen bg-cozy-bg flex flex-col p-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="size-8 text-cozy-muted" />
        <h1 className="text-2xl font-heading text-cozy-text">Settings</h1>
      </div>

      <div className="bg-cozy-surface rounded-lg p-6 max-w-md w-full mx-auto">
        <SettingsForm />
      </div>
    </main>
  );
}
