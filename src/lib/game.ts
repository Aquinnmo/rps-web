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

export const smartComputerMove = (): Move => {
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

export type GameVersion = 0 | 1;

export const COMPUTER_MOVE_STRATEGIES: Record<GameVersion, () => Move> = {
  0: randomComputerMove,
  1: smartComputerMove,
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
