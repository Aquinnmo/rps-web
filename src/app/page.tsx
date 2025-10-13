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
          className="relative flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow"
        >
          <span>Version</span>
          <div className="relative">
            <select
              id="game-version"
              value={gameVersion}
              onChange={handleVersionChange}
              className="appearance-none rounded-full bg-white/20 px-4 py-1 pr-8 text-base font-medium text-white outline-none ring-white/60 transition focus-visible:ring [&>option]:bg-[#14532d] [&>option]:text-[#fefce8] [&>option]:py-2 [&>option]:px-4 [&>option]:font-medium [&>option]:checked:bg-[#166534] [&>option]:hover:bg-[#166534]"
            >
              <option value={0} className="bg-[#14532d] text-[#fefce8] py-2 px-4 font-medium hover:bg-[#166534]">Weighted Random</option>
              <option value={1} className="bg-[#14532d] text-[#fefce8] py-2 px-4 font-medium hover:bg-[#166534]">October 13, 2025</option>
            </select>
            {/* custom caret to match site style */}
            <svg
              className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
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
