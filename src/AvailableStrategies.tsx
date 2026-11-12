import { type StrategyDetails, Strategies } from './solver/strategies';

export const AvailableStrategies: StrategyDetails[] = [
  Strategies.Intersection.Basic,
  Strategies.Intersection.Smart,
  Strategies.Anchor.End,
  Strategies.Anchor.Start,
  Strategies.Maximal.Basic,
  Strategies.AutoFill.CompleteLine,
  Strategies.Validation.OversizedBlock,
];
