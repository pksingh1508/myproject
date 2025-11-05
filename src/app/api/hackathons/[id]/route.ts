import { NextResponse } from "next/server";

import {
  getHackathonById,
  updateHackathon,
  deleteHackathon
} from "@/lib/repos/hackathons";
import { AppError } from "@/lib/errors/app-error";
import { verifyAdminRequest } from "@/lib/auth/admin-api";

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

  console.error("Unexpected error in hackathon item route:", error);
  return NextResponse.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred."
    },
    { status: 500 }
  );
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const hackathon = await getHackathonById(id);
    return NextResponse.json({ data: hackathon });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = verifyAdminRequest(request);
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const { id } = await context.params;
    const hackathon = await updateHackathon({
      ...body,
      id
    });

    return NextResponse.json({ data: hackathon });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const authResult = verifyAdminRequest(request);
  if (authResult) {
    return authResult;
  }

  try {
    const { id } = await context.params;
    await deleteHackathon(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
