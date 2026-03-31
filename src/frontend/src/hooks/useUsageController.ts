import { useEffect, useState } from "react";

const STORAGE_KEY = "viralboost_usage";
const FREE_LIMIT = 2;

export function useUsageController() {
  const [usageCount, setUsageCount] = useState<number>(() => {
    try {
      return Number.parseInt(sessionStorage.getItem(STORAGE_KEY) || "0", 10);
    } catch {
      return 0;
    }
  });
  const [isLocked, setIsLocked] = useState(false);
  const [unlockedBonus, setUnlockedBonus] = useState(false);
  const cooldown = 0;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(usageCount));
    } catch {
      // ignore
    }
  }, [usageCount]);

  const tryGenerate = (): boolean => {
    const effectiveLimit = unlockedBonus ? FREE_LIMIT + 1 : FREE_LIMIT;
    if (usageCount < effectiveLimit) {
      setUsageCount((prev) => prev + 1);
      if (unlockedBonus && usageCount >= FREE_LIMIT) {
        setUnlockedBonus(false);
      }
      return true;
    }
    setIsLocked(true);
    return false;
  };

  const dismissLock = () => {
    setIsLocked(false);
  };

  const onWatchAd = () => {
    setUnlockedBonus(true);
    setUsageCount(FREE_LIMIT);
  };

  const remaining = Math.max(
    0,
    (unlockedBonus ? FREE_LIMIT + 1 : FREE_LIMIT) - usageCount,
  );

  return {
    tryGenerate,
    isLocked,
    dismissLock,
    onWatchAd,
    cooldown,
    unlockedBonus,
    remaining,
    usageCount,
  };
}
