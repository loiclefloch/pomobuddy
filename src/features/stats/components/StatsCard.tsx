import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  secondaryText?: string;
}

export function StatsCard({ icon, value, label, secondaryText }: StatsCardProps) {
  return (
    <div className="bg-cozy-surface rounded-xl p-5">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-3xl font-bold text-cozy-text">{value}</span>
      </div>
      <p className="text-sm text-cozy-muted mt-1">{label}</p>
      {secondaryText && (
        <p className="text-xs text-cozy-muted/70 mt-1">{secondaryText}</p>
      )}
    </div>
  );
}
