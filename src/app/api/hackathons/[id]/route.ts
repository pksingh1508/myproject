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
  { params }: { params: { id: string } }
) {
  try {
    const hackathon = await getHackathonById(params.id);
    return NextResponse.json({ data: hackathon });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = verifyAdminRequest(request);
  if (authResult) {
    return authResult;
  }

  try {
    const body = await request.json();
    const hackathon = await updateHackathon({
      ...body,
      id: params.id
    });

    return NextResponse.json({ data: hackathon });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = verifyAdminRequest(request);
  if (authResult) {
    return authResult;
  }

  try {
    await deleteHackathon(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
