export const MOVES = ["rock", "paper", "scissors"] as const;

export type Move = (typeof MOVES)[number];

export const MOVE_EMOJI: Record<Move, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

let roundCount = 0;

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
  if (roundCount === 0) {
    //40% probability of user first playing rock --> 40% play paper
    if (probability < 40)
    {
      return MOVES[1];
    }
    else if (probability < 70)
    {
      return MOVES[0];
    }
    else
    {
      return MOVES[2];
    }
  }
  else
  {
    if (probability < 35)
    {
      return MOVES[1];
    }
    else if (probability < 70)
    {
      return MOVES[0];
    }
    else
    {
      return MOVES[2];
    }
  }
};

export const determineOutcome = (
  playerMove: Move,
  computerMove: Move,
): GameOutcome => {

  roundCount += 1;

  if (playerMove === computerMove) {
    return "draw";
  }

  if (
    (playerMove === "rock" && computerMove === "scissors") ||
    (playerMove === "paper" && computerMove === "rock") ||
    (playerMove === "scissors" && computerMove === "paper")
  ) {
    return "win";
  }

  return "lose";
};
