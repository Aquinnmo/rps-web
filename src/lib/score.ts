import type { GameOutcome } from "./game";

export type GameRecord = {
  wins: number;
  ties: number;
  losses: number;
};

export type StreakState = {
  outcome: GameOutcome | null;
  count: number;
};

export const initialGameRecord: GameRecord = {
  wins: 0,
  ties: 0,
  losses: 0,
};

export const initialStreakState: StreakState = {
  outcome: null,
  count: 0,
};

export const updateGameRecord = (
  record: GameRecord,
  outcome: GameOutcome,
): GameRecord => {
  switch (outcome) {
    case "win":
      return {
        ...record,
        wins: record.wins + 1,
      };
    case "lose":
      return {
        ...record,
        losses: record.losses + 1,
      };
    case "draw":
      return {
        ...record,
        ties: record.ties + 1,
      };
    default: {
      const exhaustiveCheck: never = outcome;
      throw new Error(`Unknown outcome: ${String(exhaustiveCheck)}`);
    }
  }
};

export const updateStreakState = (
  streak: StreakState,
  outcome: GameOutcome,
): StreakState => {
  if (streak.outcome === outcome) {
    return {
      outcome,
      count: streak.count + 1,
    };
  }

  return {
    outcome,
    count: 1,
  };
};

export const getStreakBadge = (outcome: GameOutcome): string => {
  switch (outcome) {
    case "win":
      return "W 🔥";
    case "lose":
      return "L 🥶";
    case "draw":
      return "T 🤔";
    default: {
      const exhaustiveCheck: never = outcome;
      throw new Error(`Unknown outcome: ${String(exhaustiveCheck)}`);
    }
  }
};
