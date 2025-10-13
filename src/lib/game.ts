export const MOVES = ["rock", "paper", "scissors"] as const;

export type Move = (typeof MOVES)[number];

export const MOVE_EMOJI: Record<Move, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
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

export const determineOutcome = (
  playerMove: Move,
  computerMove: Move,
): GameOutcome => {
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
