export interface UseUsageController {
  tryGenerate: () => boolean;
  isLocked: boolean;
  dismissLock: () => void;
  onWatchAd: () => void;
  cooldown: number;
  unlockedBonus: boolean;
  remaining: number;
  usageCount: number;
}
