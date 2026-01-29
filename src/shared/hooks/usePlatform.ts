import { useEffect, useState } from "react";

export type Platform = "macos" | "linux" | "unknown";

export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setPlatform("macos");
    } else if (userAgent.includes("linux")) {
      setPlatform("linux");
    }
  }, []);

  return platform;
}
