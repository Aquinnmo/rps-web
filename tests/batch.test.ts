import assert from "node:assert";
import { afterEach, test } from "node:test";

import {
  BATCH_SIZE,
  GAME_VERSIONS_FOR_BATCHING,
  __internal as batchInternal,
  recordGameForBatch,
} from "../src/lib/batch";
import { type GameVersion, type Move } from "../src/lib/game";

afterEach(() => {
  batchInternal.resetState();
  batchInternal.restoreDefaultSender();
});

const ALL_VERSIONS = GAME_VERSIONS_FOR_BATCHING as readonly GameVersion[];

const makeComputerMoves = (move: Move) => {
  const moves: Record<GameVersion, Move> = {
    0: move,
    1: move,
    2: move,
    3: move,
    4: move,
    5: move,
  };

  return moves;
};

test("does not send batches until 20 games have been recorded", async () => {
  const sentBatches: unknown[] = [];

  batchInternal.setBatchSender(async (payload) => {
    sentBatches.push(payload);
  });

  for (let index = 0; index < BATCH_SIZE - 1; index += 1) {
    await recordGameForBatch("rock", makeComputerMoves("paper"));
  }

  assert.strictEqual(sentBatches.length, 0);

  await recordGameForBatch("scissors", makeComputerMoves("rock"));

  assert.strictEqual(sentBatches.length, 1);

  const payload = sentBatches[0] as {
    userMoves: string;
    versionMoves: Record<GameVersion, string>;
  };

  assert.strictEqual(payload.userMoves.length, BATCH_SIZE);
  assert.match(payload.userMoves, /^[RSP]{20}$/);

  for (const version of ALL_VERSIONS) {
    const moves = payload.versionMoves[version];
    assert.strictEqual(moves.length, BATCH_SIZE);
    assert.match(moves, /^[RSP]{20}$/);
  }
});

test("resets internal state after sending a batch", async () => {
  let sendCount = 0;

  batchInternal.setBatchSender(async () => {
    sendCount += 1;
  });

  for (let index = 0; index < BATCH_SIZE; index += 1) {
    await recordGameForBatch("paper", makeComputerMoves("scissors"));
  }

  assert.strictEqual(sendCount, 1);

  const state = batchInternal.getState();
  assert.strictEqual(state.count, 0);
  assert.strictEqual(state.userMoves, "");

  for (const version of ALL_VERSIONS) {
    assert.strictEqual(state.versionMoves[version], "");
  }
});
