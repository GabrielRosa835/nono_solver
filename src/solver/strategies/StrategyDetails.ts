import type { Strategy } from './Strategy';
import type { StrategyTier } from './StrategyTier';

export type StrategyDetails = {
  id: string;
  label: string;
  description: string;
  tier: StrategyTier;
  warningNote?: string;
  strategy: Strategy;
};