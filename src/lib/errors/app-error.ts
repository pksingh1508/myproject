import type { PostgrestError } from "@supabase/supabase-js";

export type AppErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_SERVER_ERROR";

export interface AppErrorOptions {
  code?: AppErrorCode;
  status?: number;
  cause?: unknown;
  details?: Record<string, unknown>;
}

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = "AppError";
    this.code = options.code ?? "INTERNAL_SERVER_ERROR";
    this.status = options.status ?? 500;
    this.details = options.details;

    if (options.cause) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).cause = options.cause;
    }
  }
}

const SUPABASE_ERROR_CODE_MAP: Record<
  string,
  { code: AppErrorCode; status: number }
> = {
  "23505": { code: "CONFLICT", status: 409 }, // unique_violation
  "23503": { code: "BAD_REQUEST", status: 400 }, // foreign_key_violation
  "42501": { code: "FORBIDDEN", status: 403 }, // insufficient_privilege
  PGRST116: { code: "NOT_FOUND", status: 404 } // row not found
};

export function mapSupabaseError(
  error: PostgrestError,
  fallbackMessage = "Unexpected Supabase error."
) {
  const mapped = SUPABASE_ERROR_CODE_MAP[error.code ?? ""];

  if (mapped) {
    return new AppError(error.message || fallbackMessage, {
      code: mapped.code,
      status: mapped.status,
      details: error.details ? { details: error.details } : undefined,
      cause: error
    });
  }

  return new AppError(error.message || fallbackMessage, {
    code: "INTERNAL_SERVER_ERROR",
    status: 500,
    details: error.details ? { details: error.details } : undefined,
    cause: error
  });
}

export function ensureSupabaseData<T>(
  result:
    | { data: T; error: null }
    | { data: T | null; error: PostgrestError | null }
    | { data: T | null; error: null },
  options: { notFoundMessage?: string } = {}
): T {
  if ("error" in result && result.error) {
    throw mapSupabaseError(
      result.error,
      options.notFoundMessage ?? "Failed to fetch data from Supabase."
    );
  }

  if (!("data" in result)) {
    throw new AppError("Supabase response missing data property.", {
      code: "INTERNAL_SERVER_ERROR",
      status: 500
    });
  }

  if (result.data === null) {
    throw new AppError(
      options.notFoundMessage ?? "Requested resource was not found.",
      {
        code: "NOT_FOUND",
        status: 404
      }
    );
  }

  return result.data;
}
