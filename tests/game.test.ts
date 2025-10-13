import assert from "node:assert";
import test from "node:test";
import {
  determineOutcome,
  history,
  MOVES,
  OUTCOME_MESSAGES,
  resetHistory,
} from "../src/lib/game";

test("determineOutcome identifies wins", () => {
  resetHistory();
  assert.strictEqual(determineOutcome("rock", "scissors"), "win");
  assert.strictEqual(determineOutcome("paper", "rock"), "win");
  assert.strictEqual(determineOutcome("scissors", "paper"), "win");
});

test("determineOutcome identifies losses", () => {
  resetHistory();
  assert.strictEqual(determineOutcome("rock", "paper"), "lose");
  assert.strictEqual(determineOutcome("paper", "scissors"), "lose");
  assert.strictEqual(determineOutcome("scissors", "rock"), "lose");
});

test("determineOutcome identifies draws", () => {
  resetHistory();
  for (const move of MOVES) {
    assert.strictEqual(determineOutcome(move, move), "draw");
  }
});

test("determineOutcome records turn history", () => {
  resetHistory();
  const outcome = determineOutcome("rock", "scissors");

  assert.strictEqual(outcome, "win");
  assert.strictEqual(history.length, 1);
  assert.deepStrictEqual(history[0], {
    player: "rock",
    computer: "scissors",
    outcome: "win",
  });
});

test("outcome messages cover every result", () => {
  assert.deepStrictEqual(
    Object.keys(OUTCOME_MESSAGES).sort(),
    ["draw", "lose", "win"],
  );
});
