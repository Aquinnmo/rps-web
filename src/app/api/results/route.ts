import { NextResponse } from "next/server";

type Move = "rock" | "paper" | "scissors";
type GameOutcome = "win" | "lose" | "draw";

type GameResult = {
  playerMove: Move;
  computerMove: Move;
  outcome: GameOutcome;
};

const isMove = (value: unknown): value is Move =>
  value === "rock" || value === "paper" || value === "scissors";

const isOutcome = (value: unknown): value is GameOutcome =>
  value === "win" || value === "lose" || value === "draw";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const data = payload as Partial<GameResult>;

  if (!isMove(data.playerMove) || !isMove(data.computerMove) || !isOutcome(data.outcome)) {
    return NextResponse.json({ error: "Invalid game result." }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const tableName = process.env.SUPABASE_RESULTS_TABLE ?? "game_results";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: "not-configured",
        message: "Supabase environment variables are not set. Result has not been persisted.",
      },
      { status: 202 },
    );
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      player_move: data.playerMove,
      computer_move: data.computerMove,
      outcome: data.outcome,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ status: "error" }, { status: 502 });
  }

  return NextResponse.json({ status: "stored" }, { status: 201 });
}
