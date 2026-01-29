import { SessionHistory } from "./SessionHistory";
import { useSessionHistory } from "../hooks/useSessionHistory";

export function SessionHistoryContainer() {
  const { days, isLoading, hasMore, loadMore } = useSessionHistory();

  return (
    <SessionHistory
      days={days}
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
}
