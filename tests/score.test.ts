import assert from "node:assert";
import test from "node:test";
import {
  getStreakBadge,
  initialGameRecord,
  initialStreakState,
  updateGameRecord,
  updateStreakState,
} from "../src/lib/score";

test("updateGameRecord increments the correct bucket", () => {
  const winRecord = updateGameRecord(initialGameRecord, "win");
  assert.deepStrictEqual(winRecord, { wins: 1, ties: 0, losses: 0 });

  const tieRecord = updateGameRecord(winRecord, "draw");
  assert.deepStrictEqual(tieRecord, { wins: 1, ties: 1, losses: 0 });

  const lossRecord = updateGameRecord(tieRecord, "lose");
  assert.deepStrictEqual(lossRecord, { wins: 1, ties: 1, losses: 1 });
});

test("updateStreakState continues streaks and resets on change", () => {
  const firstWin = updateStreakState(initialStreakState, "win");
  assert.deepStrictEqual(firstWin, { outcome: "win", count: 1 });

  const secondWin = updateStreakState(firstWin, "win");
  assert.deepStrictEqual(secondWin, { outcome: "win", count: 2 });

  const tie = updateStreakState(secondWin, "draw");
  assert.deepStrictEqual(tie, { outcome: "draw", count: 1 });
});

test("getStreakBadge returns the expected symbols", () => {
  assert.strictEqual(getStreakBadge("win"), "W 🔥");
  assert.strictEqual(getStreakBadge("draw"), "T 🤔");
  assert.strictEqual(getStreakBadge("lose"), "L 🥶");
});
