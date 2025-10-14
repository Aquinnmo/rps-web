import { Move } from "./game";

//markov history is a dictionary within a dictionary
//first key is the value of the dictionary
//second key is the value of each move
export type MarkovHistory = Record<string, Record<Move, number>>;

export const lastThreeHistory: MarkovHistory = {
  "RRR": {"rock": 1, "paper": 1, "scissors": 1},
  "RRP": {"rock": 1, "paper": 1, "scissors": 1},
  "RRS": {"rock": 1, "paper": 1, "scissors": 1},
  "RPR": {"rock": 1, "paper": 1, "scissors": 1},
  "RPP": {"rock": 1, "paper": 1, "scissors": 1},
  "RPS": {"rock": 1, "paper": 1, "scissors": 1},
  "RSR": {"rock": 1, "paper": 1, "scissors": 1},
  "RSP": {"rock": 1, "paper": 1, "scissors": 1},
  "RSS": {"rock": 1, "paper": 1, "scissors": 1},
  "PRR": {"rock": 1, "paper": 1, "scissors": 1},
  "PRP": {"rock": 1, "paper": 1, "scissors": 1},
  "PRS": {"rock": 1, "paper": 1, "scissors": 1},
  "PPR": {"rock": 1, "paper": 1, "scissors": 1},
  "PPP": {"rock": 1, "paper": 1, "scissors": 1},
  "PPS": {"rock": 1, "paper": 1, "scissors": 1},
  "PSR": {"rock": 1, "paper": 1, "scissors": 1},
  "PSP": {"rock": 1, "paper": 1, "scissors": 1},
  "PSS": {"rock": 1, "paper": 1, "scissors": 1},
  "SRR": {"rock": 1, "paper": 1, "scissors": 1},
  "SRP": {"rock": 1, "paper": 1, "scissors": 1},
  "SRS": {"rock": 1, "paper": 1, "scissors": 1},
  "SPR": {"rock": 1, "paper": 1, "scissors": 1},
  "SPP": {"rock": 1, "paper": 1, "scissors": 1},
  "SPS": {"rock": 1, "paper": 1, "scissors": 1},
  "SSR": {"rock": 1, "paper": 1, "scissors": 1},
  "SSP": {"rock": 1, "paper": 1, "scissors": 1},
  "SSS": {"rock": 1, "paper": 1, "scissors": 1},
};