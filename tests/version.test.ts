import assert from "node:assert";
import test from "node:test";
import { getComputerMoveForVersion } from "../src/lib/game";

test("version 0 delegates to the random strategy", () => {
  const move = getComputerMoveForVersion(0, {
    0: () => "rock",
  });

  assert.strictEqual(move, "rock");
});

test("version 1 delegates to the smart strategy", () => {
  const move = getComputerMoveForVersion(1, {
    1: () => "paper",
  });

  assert.strictEqual(move, "paper");
});

test("unknown versions are rejected", () => {
  assert.throws(() => {
    getComputerMoveForVersion(1 as 0 | 1, {
      1: undefined as unknown as () => never,
    });
  });
});
