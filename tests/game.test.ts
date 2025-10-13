import assert from "node:assert";
import test from "node:test";
import { determineOutcome, MOVES, OUTCOME_MESSAGES } from "../src/lib/game";

test("determineOutcome identifies wins", () => {
  assert.strictEqual(determineOutcome("rock", "scissors"), "win");
  assert.strictEqual(determineOutcome("paper", "rock"), "win");
  assert.strictEqual(determineOutcome("scissors", "paper"), "win");
});

test("determineOutcome identifies losses", () => {
  assert.strictEqual(determineOutcome("rock", "paper"), "lose");
  assert.strictEqual(determineOutcome("paper", "scissors"), "lose");
  assert.strictEqual(determineOutcome("scissors", "rock"), "lose");
});

test("determineOutcome identifies draws", () => {
  for (const move of MOVES) {
    assert.strictEqual(determineOutcome(move, move), "draw");
  }
});

test("outcome messages cover every result", () => {
  assert.deepStrictEqual(
    Object.keys(OUTCOME_MESSAGES).sort(),
    ["draw", "lose", "win"],
  );
});
