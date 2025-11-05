import { NextResponse } from "next/server";

import { listHackathons, createHackathon } from "@/lib/repos/hackathons";
import { AppError } from "@/lib/errors/app-error";
import { verifyAdminRequest } from "@/lib/auth/admin-api";
import type { HackathonFilterInput } from "@/lib/validation/hackathons";

function parseFilters(request: Request): Partial<HackathonFilterInput> {
  const url = new URL(request.url);
  const params = url.searchParams;

  const statusParam = params.get("status");
  const themesParam = params.get("themes");
  const search = params.get("search") ?? undefined;

  const status = statusParam
    ? (statusParam.split(",").map((s) => s.trim()) as HackathonFilterInput["status"])
    : undefined;

  return {
    status,
    themes: themesParam
      ? themesParam.split(",").map((theme) => theme.trim())
      : undefined,
    search
  };
}

function handleError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.code,
        message: error.message,
        details: error.details
      },
      { status: error.status }
    );
  }

  if (error instanceof NextResponse) {
    return error;
  }

  console.error("Unexpected error in hackathons route:", error);
  return NextResponse.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred."
    },
    { status: 500 }
  );
}

export async function GET(request: Request) {
  try {
    const filters = parseFilters(request);
    const hackathons = await listHackathons(filters);

    return NextResponse.json({ data: hackathons });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  const authResult = verifyAdminRequest(request);
  if (authResult) {
    return authResult;
  }

  try {
    const payload = await request.json();
    const hackathon = await createHackathon(payload);

    return NextResponse.json({ data: hackathon }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
