import { Move } from "./game";

//markov history is a dictionary within a dictionary
//first key is the value of the dictionary
//second key is the value of each move
export type MarkovHistory = Record<string, Record<Move, number>>;

// Generate all possible combinations for n-length history
export function generateMarkovContext(n: number): MarkovHistory {
  const letters = ["R", "P", "S"];
  const result: MarkovHistory = {};

  function helper(prefix: string, depth: number) {
    if (depth === 0) {
      result[prefix] = { rock: 1, paper: 1, scissors: 1 };
      return;
    }
    for (const l of letters) {
      helper(prefix + l, depth - 1);
    }
  }

  helper("", n);
  return result;
}

export const lastThreeHistory: MarkovHistory = generateMarkovContext(3);
export const lastFiveHistory: MarkovHistory = generateMarkovContext(5);
export const lastSevenHistory: MarkovHistory = generateMarkovContext(7);