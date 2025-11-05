import { NextResponse } from "next/server";

const ADMIN_HEADER_KEY = "x-admin-key";

export function getExpectedAdminKey() {
  return process.env.ADMIN_API_KEY || process.env.NEXT_PUBLIC_ADMIN_API_KEY;
}

export function verifyAdminRequest(request: Request) {
  const expectedKey = getExpectedAdminKey();

  if (!expectedKey) {
    return NextResponse.json(
      {
        error: "Server misconfiguration",
        message: "Missing ADMIN_API_KEY environment variable."
      },
      { status: 500 }
    );
  }

  const providedKey = request.headers.get(ADMIN_HEADER_KEY);

  if (!providedKey || providedKey !== expectedKey) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: `Provide a valid X-ADMIN-KEY header to access this endpoint.`
      },
      { status: 401 }
    );
  }

  return null;
}

export function requireAdminKey(request: Request) {
  const response = verifyAdminRequest(request);

  if (response) {
    throw response;
  }
}
