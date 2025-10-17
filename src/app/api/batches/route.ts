import { NextResponse } from "next/server";

import { GAME_VERSIONS_FOR_BATCHING, type BatchPayload } from "@/lib/batch";

const MOVE_PATTERN = /^[RSP]{20}$/;

type VersionMovesPayload = BatchPayload["versionMoves"];

const isValidMoveString = (value: unknown): value is string =>
  typeof value === "string" && MOVE_PATTERN.test(value);

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const data = payload as Partial<BatchPayload> & { versionMoves?: Record<string, unknown> };

  if (!isValidMoveString(data.userMoves)) {
    return NextResponse.json({ error: "Invalid batch payload." }, { status: 400 });
  }

  if (!data.versionMoves || typeof data.versionMoves !== "object") {
    return NextResponse.json({ error: "Invalid batch payload." }, { status: 400 });
  }

  const versionMoves = data.versionMoves as Record<string, unknown>;
  const normalizedVersionMoves: VersionMovesPayload = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
  };

  for (const version of GAME_VERSIONS_FOR_BATCHING) {
    const value = versionMoves[String(version)];

    if (!isValidMoveString(value)) {
      return NextResponse.json({ error: "Invalid batch payload." }, { status: 400 });
    }

    normalizedVersionMoves[version] = value;
  }

  // TODO: Set SUPABASE_URL to your Supabase project URL (e.g. https://your-project.supabase.co).
  const supabaseUrl = process.env.SUPABASE_URL;
  // TODO: Set SUPABASE_SERVICE_ROLE_KEY with a service role key that can insert into the batches table.
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // Optionally override the table name with SUPABASE_BATCHES_TABLE.
  const tableName = process.env.SUPABASE_BATCHES_TABLE ?? "batches";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        status: "not-configured",
        message: "Supabase environment variables are not set. Batch has not been persisted.",
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
      user_moves: data.userMoves,
      v0_moves: normalizedVersionMoves[0],
      v1_moves: normalizedVersionMoves[1],
      v2_moves: normalizedVersionMoves[2],
      v3_moves: normalizedVersionMoves[3],
      v4_moves: normalizedVersionMoves[4],
      v5_moves: normalizedVersionMoves[5],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ status: "error" }, { status: 502 });
  }

  return NextResponse.json({ status: "stored" }, { status: 201 });
}
