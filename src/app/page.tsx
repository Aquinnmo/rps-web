"use client";

import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import {
  determineOutcome,
  getComputerMoveForVersion,
  type GameVersion,
  MOVES,
  MOVE_EMOJI,
  OUTCOME_MESSAGES,
  type GameOutcome,
  type Move,
} from "../lib/game";

type GameResult = {
  playerMove: Move;
  computerMove: Move;
  outcome: GameOutcome;
};

const recordGameResult = async (result: GameResult) => {
  try {
    await fetch("/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
      keepalive: true,
    });
  } catch {
    // Intentionally swallow errors so the game remains playable if persistence fails.
  }
};

export default function Home() {
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [outcome, setOutcome] = useState<GameOutcome | null>(null);
  const [gameVersion, setGameVersion] = useState<GameVersion>(1);

  const lastMoveEmoji = useMemo(() => {
    if (!computerMove) {
      return "?";
    }

    return MOVE_EMOJI[computerMove];
  }, [computerMove]);

  const outcomeMessage = outcome ? OUTCOME_MESSAGES[outcome] : "\u00A0";

  const handlePlayerMove = useCallback(
    (playerMove: Move) => {
      const nextComputerMove = getComputerMoveForVersion(gameVersion);
      const nextOutcome = determineOutcome(playerMove, nextComputerMove);

      setComputerMove(nextComputerMove);
      setOutcome(nextOutcome);

      void recordGameResult({
        playerMove,
        computerMove: nextComputerMove,
        outcome: nextOutcome,
      });
    },
    [gameVersion],
  );

  const handleVersionChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setGameVersion(Number(event.target.value) as GameVersion);
    },
    [],
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center gap-12 bg-transparent text-center">
      <div className="absolute top-6 flex w-full justify-center">
        <label
          htmlFor="game-version"
          className="flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow"
        >
          <span>Version</span>
          <select
            id="game-version"
            value={gameVersion}
            onChange={handleVersionChange}
            className="rounded-full bg-white/20 px-3 py-1 text-base font-medium text-white outline-none ring-white/60 transition focus-visible:ring"
          >
            <option value={0}>Version 0</option>
            <option value={1}>Version 1</option>
          </select>
        </label>
      </div>
      <div className="text-[clamp(8rem,18vw,14rem)] font-semibold leading-none">
        {lastMoveEmoji}
      </div>
      <p className="text-3xl font-semibold uppercase tracking-wide">{outcomeMessage}</p>
      <div className="flex flex-wrap justify-center gap-6">
        {MOVES.map((move) => (
          <button
            key={move}
            type="button"
            onClick={() => handlePlayerMove(move)}
            className="h-24 w-24 rounded-full bg-white/10 text-6xl text-white shadow-lg transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            aria-label={move}
          >
            {MOVE_EMOJI[move]}
          </button>
        ))}
      </div>
    </div>
  );
}
