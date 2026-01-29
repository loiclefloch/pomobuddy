import { BarChart3, Trophy, Settings, X } from "lucide-react";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

function MenuItem({ icon, label, onClick, variant = "default" }: MenuItemProps) {
  const textColor = variant === "danger" ? "text-red-400" : "text-cozy-text";
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-cozy-elevated transition-colors ${textColor}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

interface TrayMenuItemsProps {
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onQuit: () => void;
}

export function TrayMenuItems({
  onOpenStats,
  onOpenAchievements,
  onOpenSettings,
  onQuit,
}: TrayMenuItemsProps) {
  return (
    <div className="flex flex-col w-full">
      <MenuItem
        icon={<BarChart3 className="size-4 text-cozy-muted" />}
        label="Stats & History"
        onClick={onOpenStats}
      />
      <MenuItem
        icon={<Trophy className="size-4 text-cozy-muted" />}
        label="Achievements"
        onClick={onOpenAchievements}
      />
      <MenuItem
        icon={<Settings className="size-4 text-cozy-muted" />}
        label="Settings"
        onClick={onOpenSettings}
      />

      <div className="w-full h-px bg-cozy-border my-2" />

      <MenuItem
        icon={<X className="size-4" />}
        label="Quit"
        onClick={onQuit}
        variant="danger"
      />
    </div>
  );
}
