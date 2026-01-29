export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date());
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === formatDate(yesterday);
}

export function getDateLabel(dateStr: string): string {
  if (isToday(dateStr)) return "Today";
  if (isYesterday(dateStr)) return "Yesterday";

  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
