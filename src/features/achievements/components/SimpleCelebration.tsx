import * as Icons from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { AchievementTier } from "../types";
import { cn } from "@/shared/lib/utils";

interface SimpleCelebrationProps {
  icon: string;
  tier: AchievementTier;
  title: string;
  description: string;
  onDismiss: () => void;
}

const tierIconColors: Record<AchievementTier, string> = {
  bronze: "text-[#CD7F32]",
  silver: "text-[#C0C0C0]",
  gold: "text-[#FFD700]",
  platinum: "text-[#E5E4E2]",
};

const tierBorderColors: Record<AchievementTier, string> = {
  bronze: "border-[#CD7F32]/30",
  silver: "border-[#C0C0C0]/40",
  gold: "border-[#FFD700]/50",
  platinum: "border-[#E5E4E2]/60",
};

function getIcon(iconName: string): React.ComponentType<{ className?: string }> | null {
  const IconComponent = (Icons as Record<string, unknown>)[iconName];
  if (typeof IconComponent === "function") {
    return IconComponent as React.ComponentType<{ className?: string }>;
  }
  return Icons.Award;
}

export function SimpleCelebration({
  icon,
  tier,
  title,
  description,
  onDismiss,
}: SimpleCelebrationProps) {
  const Icon = getIcon(icon);

  return (
    <div
      data-testid="simple-celebration"
      className={cn(
        "flex flex-col items-center text-center p-8 bg-cozy-surface rounded-2xl border-2",
        tierBorderColors[tier]
      )}
    >
      <div className="flex items-center justify-center w-[100px] h-[100px] rounded-full bg-cozy-elevated mb-6">
        {Icon && (
          <Icon className={cn("size-12", tierIconColors[tier])} />
        )}
      </div>

      <h2 className="font-heading text-[32px] text-cozy-text mb-3">
        {title}
      </h2>

      <p className="text-lg text-cozy-muted mb-8 max-w-md">
        {description}
      </p>

      <Button
        onClick={onDismiss}
        variant="default"
        size="lg"
        className="bg-cozy-accent hover:bg-cozy-accent/90 text-cozy-bg"
      >
        Continue
      </Button>
    </div>
  );
}
