import { MarkovHistory, lastFiveHistory, lastSevenHistory, lastThreeHistory } from "./markovDictionaries";

export const MOVES = ["rock", "paper", "scissors"] as const;

export type Move = (typeof MOVES)[number];

export const MOVE_EMOJI: Record<Move, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

export let history: Turn[] = [];

export const resetHistory = (): void => {
  history = [];
  // reset markov transition counts back to neutral priors (1)
  for (const windowKey of Object.keys(lastThreeHistory)) {
    const bucket = lastThreeHistory[windowKey];
    bucket["rock"] = 1;
    bucket["paper"] = 1;
    bucket["scissors"] = 1;
  }
  for (const windowKey of Object.keys(lastFiveHistory)) {
    const bucket = lastFiveHistory[windowKey];
    bucket["rock"] = 1;
    bucket["paper"] = 1;
    bucket["scissors"] = 1;
  }
  for (const windowKey of Object.keys(lastSevenHistory)) {
    const bucket = lastSevenHistory[windowKey];
    bucket["rock"] = 1;
    bucket["paper"] = 1;
    bucket["scissors"] = 1;
  }
};

export type Turn = {
  player: Move;
  computer: Move;
  outcome: GameOutcome;
};

export type GameOutcome = "win" | "lose" | "draw";

export const OUTCOME_MESSAGES: Record<GameOutcome, string> = {
  win: "You win!",
  lose: "You lose!",
  draw: "It's a draw!",
};

export const randomComputerMove = (): Move => {
  const index = Math.floor(Math.random() * MOVES.length);
  return MOVES[index];
};

export const ogMarkov = (): Move => {
  //100 possible outcomes, can give a range of probilities for each move
  const probability = Math.floor(Math.random() * 100);
  if (history.length === 0) {
    //36% probability of user first playing rock --> play paper 36% of the time
    //33% probability of user first playing paper --> play scissors 33% of the time
    //32% probability of user first playing rock --> 32% play paper
    if (probability < 36)
    {
      return MOVES[1];
    }
    else if (probability < 69) //nice
    {
      return MOVES[2];
    }
    else
    {
      return MOVES[0];
    }
  }
  else 
  {
    return singleOrderMarkov();
  }
};

export const markov3 = (
  notMove: Move | null
): Move =>
{
  const bucket = lastThreeHistory[getWindow(3)];
  const result = bucketComparison(bucket);
  if (result === 3)
  {
    return ogMarkov();
  }
  else if (result === 2)
  {
    //there is a tie
    const move: Move = oddMoveOut(bucket);
    if (move === notMove || notMove === null)
    {
      //if the odd moves out are the same, continue down chain
      return ogMarkov();
    }
    else
    {
      //odd moves out are different, return what is not either odd move out
      if ((notMove === "rock" || move === "rock") && (notMove === "paper" || move === "paper")) {
        return "scissors";
      } else if ((notMove === "scissors" || move === "scissors") && (notMove === "paper" || move === "paper")) {
        return "rock";
      } else {
        return "paper";
      }
    }
  }
  else
  {
    return markovChain(lastThreeHistory, 3);
  }
};

export const markov5 = (
  notMove: Move | null
): Move =>
{
  const bucket = lastFiveHistory[getWindow(5)];
  const result = bucketComparison(bucket);
  if (result === 3)
  {
    return markov3(notMove);
  }
  else if (result === 2)
  {
    //there is a tie
    const move: Move = oddMoveOut(bucket);
    if (move === notMove || notMove === null)
    {
      //if the odd moves out are the same, continue down chain
      return markov3(move);
    }
    else
    {
      //odd moves out are different, return what is not either odd move out
      if ((notMove === "rock" || move === "rock") && (notMove === "paper" || move === "paper")) {
        return "scissors";
      } else if ((notMove === "scissors" || move === "scissors") && (notMove === "paper" || move === "paper")) {
        return "rock";
      } else {
        return "paper";
      }
    }
  }
  else
  {
    return markovChain(lastFiveHistory, 5);
  }
};

export const markov7 = (): Move =>
{
  const bucket = lastSevenHistory[getWindow(7)];
  const result = bucketComparison(bucket);
  if (result === 3)
  {
    return markov5(null);
  }
  else if (result === 2)
  {
    //there is a tie
    const move: Move = oddMoveOut(bucket);
    //move down the chain
    return markov5(move);
  }
  else
  {
    return markovChain(lastSevenHistory, 7);
  }
};

export const dynamicMarkov = (): Move => 
{
  if (history.length >= 7)
  {
    return markov7();
  }
  else if (history.length >= 5)
  {
    return markov5(null);
  }
  else if (history.length >= 3)
  {
    return markov3(null);
  }
  else if (history.length >= 1)
  {
    return ogMarkov();
  }
  else
  {
    return randomComputerMove();
  }
};

//returns 3 if all moves have equal probability
//returns 2 if two probabilities are tied
//returns 1 if there is a clear choice
const bucketComparison = (bucket: Record<Move, number>): number =>
{
  //all probabilities are equal
  if (bucket["rock"] === bucket["paper"] && bucket["rock"] === bucket["scissors"])
  {
    return 3;
  }
  //two moves are equal
  else if (bucket["rock"] === bucket["paper"] || bucket["rock"] === bucket["scissors"] || bucket["paper"] === bucket["scissors"])
  {
    return 2;
  }

  //no probabilities are equal
  return 1;
};

const oddMoveOut = (bucket: Record<Move, number>): Move =>
{
  if (bucket["rock"] < bucket["paper"])
  {
    return "rock";
  }
  else if (bucket["paper"] < bucket["rock"])
  {
    return "paper";
  }
  else
  {
    return "scissors";
  }
};

export const determineOutcome = (
  playerMove: Move,
  computerMove: Move,
): GameOutcome => {
  let outcome: GameOutcome;

  if (playerMove === computerMove) {
    outcome = "draw";
  } else if (
    (playerMove === "rock" && computerMove === "scissors") ||
    (playerMove === "paper" && computerMove === "rock") ||
    (playerMove === "scissors" && computerMove === "paper")
  ) {
    outcome = "win";
  } else {
    outcome = "lose";
  }

  //add to markov tables here
  if (history.length >= 3)
  {
    const window = getWindow(3);
    lastThreeHistory[window][playerMove]++;
  }

  if (history.length >= 5)
  {
    const window = getWindow(5);
    lastFiveHistory[window][playerMove]++;
  }
 
  if (history.length >= 7)
  {
    const window = getWindow(7);
    lastSevenHistory[window][playerMove]++;
  }

  history = [
    ...history,
    {
      player: playerMove,
      computer: computerMove,
      outcome,
    },
  ];

  return outcome;
};


export const singleOrderMarkov = (): Move =>
{
  if (history.length === 1)
  {
    return randomComputerMove();
  }

  const lastTurn = history.at(-1);

  if (!lastTurn)
  {
    return randomComputerMove();
  }

  //if the user last one, they will repeat so throw what beats them
  if (lastTurn.outcome === "win")
  {
    return MOVES[(MOVES.indexOf(lastTurn.player) + 1) % 3]
  }
  //if the user lost the last one, they throw what beats the computer so throw what beat that
  else if (lastTurn.outcome === "lose")
  {
    return MOVES[(MOVES.indexOf(lastTurn.computer) + 2) % 3];
  }
  //if a tie apparently they cycle one more
  return MOVES[(MOVES.indexOf(lastTurn.player) + 2) % 3]
};

export const markovChain = (
  context: MarkovHistory,
  n: number,
): Move =>
{
  //if this is not 
  if (history.length < n)
  {
    return randomComputerMove();
  }
  
  const window: string = getWindow(n);

  const rocks: number = context[window]["rock"];
  const papers: number = context[window]["paper"];
  const scissors: number = context[window]["scissors"];

  //chunky if statement for if one is more than the other two
  if (rocks > papers && rocks > scissors)
  {
    return "paper";
  }
  else if (papers > rocks && papers > scissors)
  {
    return "scissors";
  }
  else if (scissors > papers && scissors > rocks)
  {
    return "rock";
  }

  const probabilities: Record<Move, number> = {
    "rock": 36,
    "paper": 33,
    "scissors": 31,
  };

  //another chunky if statement for if two are tied
  //paper not tied
  if (rocks > papers && scissors > papers)
  {
    const num = Math.random() * (probabilities["rock"] + probabilities["scissors"]);

    if (num < probabilities["rock"])
    {
      //chosen they will choose rock, choose paper
      return "paper"
    }
    else
    {
      //chosen they will choose scissors, choose rock
      return "rock";
    }
  }
  //rock not tied
  else if (papers > rocks && scissors > rocks)
  {
    const num = Math.random() * (probabilities["paper"] + probabilities["scissors"]);

    if (num < probabilities["paper"])
    {
      //chosen they will choose paper, choose scissors
      return "scissors"
    }
    else
    {
      //chosen they will choose scissors, choose rock
      return "rock";
    }
  }
  //scissors not tied
  else if (rocks > scissors && papers > scissors)
  {
    const num = Math.random() * (probabilities["rock"] + probabilities["paper"]);

    if (num < probabilities["rock"])
    {
      //chosen they will choose rock, choose paper
      return "paper"
    }
    else
    {
      //chosen they will choose paper, choose scissors
      return "scissors";
    }
  }

  //if all are even, throw a random move with weighted probabilities
  return randomComputerMove();
};

export const getWindow = (n: number): string =>
{
  //start with an empty string
  let window: string = "";

  for (let i = 0; i < n; i++)
  {
    //get the nth closest to the end, then the (n-1)th, etc.
    const curMove = history.at(-1 * (n - i))?.player;

    //translating this string into a char, then concatenating
    if (curMove === MOVES[0])
    {
      window = window + "R";
    }
    else if (curMove === MOVES[1])
    {
      window = window + "P";
    }
    else if (curMove === MOVES[2])
    {
      window = window + "S";
    }
    else
    {
      throw new Error("Not rock paper or scissors.");
    }
  }

  return window;
};

export type GameVersion = 0 | 1 | 2 | 3 | 4 | 5;

export const COMPUTER_MOVE_STRATEGIES: Record<GameVersion, () => Move> = {
  0: randomComputerMove,
  1: ogMarkov,
  2: () => markovChain(lastThreeHistory, 3),
  3: () => markovChain(lastFiveHistory, 5),
  4: () => markovChain(lastSevenHistory, 7),
  5: () => dynamicMarkov(),
};

export const getComputerMoveForVersion = (
  version: GameVersion,
  strategies: Partial<Record<GameVersion, () => Move>> = {},
): Move => {
  const mergedStrategies: Record<GameVersion, () => Move> = {
    ...COMPUTER_MOVE_STRATEGIES,
    ...strategies,
  };

  const strategy = mergedStrategies[version];

  if (!strategy) {
    throw new Error(`Unsupported game version: ${version}`);
  }

  return strategy();
};
