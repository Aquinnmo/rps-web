import { type GameVersion, type Move } from "./game";

export const BATCH_SIZE = 20;

export type ComputerMovesByVersion = Record<GameVersion, Move>;

export type BatchPayload = {
  userMoves: string;
  versionMoves: Record<GameVersion, string>;
};

type BatchSender = (payload: BatchPayload) => Promise<void>;

type BatchState = {
  count: number;
  userMoves: string;
  versionMoves: Record<GameVersion, string>;
};

const GAME_VERSIONS: GameVersion[] = [0, 1, 2, 3, 4, 5];

const moveToLetterMap: Record<Move, "R" | "P" | "S"> = {
  rock: "R",
  paper: "P",
  scissors: "S",
};

const createInitialState = (): BatchState => ({
  count: 0,
  userMoves: "",
  versionMoves: {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  },
});

let state: BatchState = createInitialState();

const defaultBatchSender: BatchSender = async (payload) => {
  await fetch("/api/batches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });
};

let sendBatch: BatchSender = defaultBatchSender;

const moveToLetter = (move: Move): "R" | "P" | "S" => moveToLetterMap[move];

const cloneVersionMoves = (moves: Record<GameVersion, string>): Record<GameVersion, string> => ({
  0: moves[0],
  1: moves[1],
  2: moves[2],
  3: moves[3],
  4: moves[4],
  5: moves[5],
});

export const recordGameForBatch = async (
  playerMove: Move,
  computerMoves: ComputerMovesByVersion,
): Promise<void> => {
  for (const version of GAME_VERSIONS) {
    if (!(version in computerMoves)) {
      throw new Error(`Missing computer move for version ${version}`);
    }
  }

  state = {
    count: state.count + 1,
    userMoves: state.userMoves + moveToLetter(playerMove),
    versionMoves: {
      0: state.versionMoves[0] + moveToLetter(computerMoves[0]),
      1: state.versionMoves[1] + moveToLetter(computerMoves[1]),
      2: state.versionMoves[2] + moveToLetter(computerMoves[2]),
      3: state.versionMoves[3] + moveToLetter(computerMoves[3]),
      4: state.versionMoves[4] + moveToLetter(computerMoves[4]),
      5: state.versionMoves[5] + moveToLetter(computerMoves[5]),
    },
  };

  if (state.count < BATCH_SIZE) {
    return;
  }

  const payload: BatchPayload = {
    userMoves: state.userMoves,
    versionMoves: cloneVersionMoves(state.versionMoves),
  };

  state = createInitialState();

  try {
    await sendBatch(payload);
  } catch {
    // Swallow errors to keep the game playable even if persistence fails.
  }
};

export const GAME_VERSIONS_FOR_BATCHING = GAME_VERSIONS;

export const __internal = {
  resetState: () => {
    state = createInitialState();
  },
  setBatchSender: (sender: BatchSender) => {
    sendBatch = sender;
  },
  restoreDefaultSender: () => {
    sendBatch = defaultBatchSender;
  },
  getState: (): BatchState => state,
};
