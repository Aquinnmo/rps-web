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
import {
  GAME_VERSIONS_FOR_BATCHING,
  recordGameForBatch,
  type ComputerMovesByVersion,
} from "../lib/batch";
import {
  getStreakBadge,
  initialGameRecord,
  initialStreakState,
  updateGameRecord,
  updateStreakState,
} from "../lib/score";

export default function Home() {
  const [computerMove, setComputerMove] = useState<Move | null>(null);
  const [outcome, setOutcome] = useState<GameOutcome | null>(null);
  const [gameVersion, setGameVersion] = useState<GameVersion>(5);
  const [record, setRecord] = useState(() => ({ ...initialGameRecord }));
  const [streak, setStreak] = useState(() => ({ ...initialStreakState }));

  const lastMoveEmoji = useMemo(() => {
    if (!computerMove) {
      return "?";
    }

    return MOVE_EMOJI[computerMove];
  }, [computerMove]);

  const outcomeMessage = outcome ? OUTCOME_MESSAGES[outcome] : "\u00A0";

  const handlePlayerMove = useCallback(
    (playerMove: Move) => {
      const computerMovesByVersion = GAME_VERSIONS_FOR_BATCHING.reduce(
        (accumulator, version) => {
          accumulator[version] = getComputerMoveForVersion(version);
          return accumulator;
        },
        {} as ComputerMovesByVersion,
      );

      const nextComputerMove = computerMovesByVersion[gameVersion];
      const nextOutcome = determineOutcome(playerMove, nextComputerMove);

      setComputerMove(nextComputerMove);
      setOutcome(nextOutcome);
      setRecord((previousRecord) => updateGameRecord(previousRecord, nextOutcome));
      setStreak((previousStreak) => updateStreakState(previousStreak, nextOutcome));

      void recordGameForBatch(playerMove, computerMovesByVersion);
    },
    [gameVersion],
  );

  const handleVersionChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setGameVersion(Number(event.target.value) as GameVersion);
    },
    [],
  );

  const totalGames = record.wins + record.ties + record.losses;
  const recordDisplay =
    totalGames > 0
      ? `${record.wins} - ${record.ties} - ${record.losses} (${(((record.wins * 2 + record.ties) / (totalGames * 2)) * 100).toFixed(2)}%)`
      : "Wins - Ties - Losses";
  const streakDisplay =
    streak.outcome !== null ? `${getStreakBadge(streak.outcome)}${streak.count}` : "—";

  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent">
      <div
        className="flex flex-col items-center gap-4 px-6 text-center sm:pt-24"
        style={{ paddingTop: "calc(5rem + env(safe-area-inset-top))" }}
      >
        <div className="flex w-full max-w-md flex-col items-stretch gap-4 sm:max-w-2xl">
          <div className="flex flex-col gap-4 rounded-3xl bg-white/10 px-5 py-4 text-white shadow sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <span className="text-xs font-semibold uppercase tracking-wide text-white/70">Record</span>
              <span aria-live="polite" className="text-lg font-semibold tracking-tight sm:text-xl">
                {recordDisplay}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 sm:items-end">
              <span className="text-xs font-semibold uppercase tracking-wide text-white/70">Streak</span>
              <span aria-live="polite" className="text-lg font-semibold tracking-tight sm:text-xl">
                {streakDisplay}
              </span>
            </div>
          </div>
          <label
            htmlFor="game-version"
            className="relative flex w-full flex-col items-stretch gap-2 rounded-3xl bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:text-base"
          >
            <span className="text-center sm:text-left">Brain Power Level</span>
            <div className="relative w-full sm:w-auto">
              <select
                id="game-version"
                value={gameVersion}
                onChange={handleVersionChange}
                className="w-full appearance-none rounded-full bg-white/20 px-4 py-2 pr-10 text-base font-medium text-white outline-none ring-white/60 transition focus-visible:ring [&>option]:bg-[#14532d] [&>option]:px-4 [&>option]:py-2 [&>option]:font-medium [&>option]:text-[#fefce8] [&>option]:hover:bg-[#166534] [&>option]:checked:bg-[#166534]"
              >
                <option value={0} className="bg-[#14532d] px-4 py-2 font-medium text-[#fefce8] hover:bg-[#166534]">
                  Kindergarden (Elementary)
                </option>
                <option value={1} className="bg-[#14532d] px-4 py-2 font-medium text-[#fefce8] hover:bg-[#166534]">
                  Freshman
                </option>
                <option value={2} className="bg-[#14532d] px-4 py-2 font-medium text-[#fefce8] hover:bg-[#166534]">
                  Sophmore
                </option>
                <option value={3} className="bg-[#14532d] px-4 py-2 font-medium text-[#fefce8] hover:bg-[#166534]">
                  Junior
                </option>
                <option value={4} className="bg-[#14532d] px-4 py-2 font-medium text-[#fefce8] hover:bg-[#166534]">
                  Senior
                </option>
                <option value={5} className="bg-[#14532d] px-4 py-2 font-medium text-[#fefce8] hover:bg-[#166534]">
                  Undergraduate
                </option>
              </select>
              {/* custom caret to match site style */}
              <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80 sm:right-2"
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
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-12 px-6 pb-16 text-center">
        <div className="text-[clamp(8rem,18vw,14rem)] font-semibold leading-none">{lastMoveEmoji}</div>
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
    </div>
  );
}
