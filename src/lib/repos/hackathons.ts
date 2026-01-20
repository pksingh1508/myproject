import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import {
  hackathonFilterSchema,
  createHackathonSchema,
  updateHackathonSchema,
  type CreateHackathonInput,
  type HackathonFilterInput,
  type UpdateHackathonInput
} from "@/lib/validation/hackathons";
import {
  AppError,
  ensureSupabaseData,
  mapSupabaseError
} from "@/lib/errors/app-error";
import { createSupabaseServerClientFromAuth } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { Hackathon } from "@/types/database";

const HACKATHON_SELECT_COLUMNS =
  "id,title,slug,description,short_description,banner_url,location_type,location_details,venue_address,start_date,end_date,registration_start,registration_end,prize_pool,first_prize,second_prize,third_prize,participation_fee,max_participants,current_participants,min_team_size,max_team_size,status,themes,requirements,rules,created_by,created_at,updated_at";

async function resolveUserClient(client?: SupabaseClient) {
  if (client) {
    return client;
  }
  return createSupabaseServerClientFromAuth();
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normaliseSlug(title: string, providedSlug?: string) {
  const base = providedSlug ?? title;
  return toSlug(base);
}

function mapCreatePayload(payload: CreateHackathonInput) {
  return {
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    short_description: payload.short_description ?? null,
    banner_url: payload.banner_url ?? null,
    location_type: payload.location_type,
    location_details: payload.location_details ?? null,
    venue_address: payload.venue_address ?? null,
    start_date: payload.start_date,
    end_date: payload.end_date,
    registration_start: payload.registration_start,
    registration_end: payload.registration_end,
    prize_pool: payload.prize_pool,
    first_prize: payload.first_prize ?? null,
    second_prize: payload.second_prize ?? null,
    third_prize: payload.third_prize ?? null,
    participation_fee: payload.participation_fee,
    max_participants:
      payload.max_participants !== undefined
        ? payload.max_participants
        : null,
    min_team_size: payload.min_team_size ?? 1,
    max_team_size: payload.max_team_size ?? 4,
    status: payload.status ?? "draft",
    themes: payload.themes ?? null,
    requirements: payload.requirements ?? null,
    rules: payload.rules ?? null
  };
}

function mapUpdatePayload(payload: UpdateHackathonInput) {
  const update: Record<string, unknown> = {};

  if (payload.title !== undefined) update.title = payload.title;
  if (payload.slug !== undefined) update.slug = payload.slug;
  if (payload.description !== undefined)
    update.description = payload.description;
  if (payload.short_description !== undefined)
    update.short_description = payload.short_description ?? null;
  if (payload.banner_url !== undefined)
    update.banner_url = payload.banner_url ?? null;
  if (payload.location_type !== undefined)
    update.location_type = payload.location_type;
  if (payload.location_details !== undefined)
    update.location_details = payload.location_details ?? null;
  if (payload.venue_address !== undefined)
    update.venue_address = payload.venue_address ?? null;
  if (payload.start_date !== undefined) update.start_date = payload.start_date;
  if (payload.end_date !== undefined) update.end_date = payload.end_date;
  if (payload.registration_start !== undefined)
    update.registration_start = payload.registration_start;
  if (payload.registration_end !== undefined)
    update.registration_end = payload.registration_end;
  if (payload.prize_pool !== undefined) update.prize_pool = payload.prize_pool;
  if (payload.first_prize !== undefined)
    update.first_prize = payload.first_prize ?? null;
  if (payload.second_prize !== undefined)
    update.second_prize = payload.second_prize ?? null;
  if (payload.third_prize !== undefined)
    update.third_prize = payload.third_prize ?? null;
  if (payload.participation_fee !== undefined)
    update.participation_fee = payload.participation_fee;
  if (payload.max_participants !== undefined)
    update.max_participants = payload.max_participants;
  if (payload.min_team_size !== undefined)
    update.min_team_size = payload.min_team_size;
  if (payload.max_team_size !== undefined)
    update.max_team_size = payload.max_team_size;
  if (payload.status !== undefined) update.status = payload.status;
  if (payload.themes !== undefined) update.themes = payload.themes ?? null;
  if (payload.requirements !== undefined)
    update.requirements = payload.requirements ?? null;
  if (payload.rules !== undefined) update.rules = payload.rules ?? null;

  return update;
}

export async function listHackathons(
  filters: Partial<HackathonFilterInput> = {},
  client?: SupabaseClient
) {
  const parsedFilters = hackathonFilterSchema.parse(filters);

  // Check if we are requesting only public data (no drafts).
  // If so, we use the service role client to ensure visibility regardless of RLS,
  // fixing the issue where "completed" hackathons were hidden for anonymous users.
  const isPublicRequest = parsedFilters.status.every((s) =>
    ["published", "ongoing", "completed"].includes(s)
  );

  let supabase: SupabaseClient;
  if (client) {
    supabase = client;
  } else if (isPublicRequest) {
    supabase = createServiceRoleClient() as SupabaseClient;
  } else {
    supabase = await resolveUserClient();
  }

  let query = supabase
    .from("hackathons")
    .select(HACKATHON_SELECT_COLUMNS)
    .order("start_date", { ascending: true });

  if (parsedFilters.status && parsedFilters.status.length > 0) {
    query = query.in("status", parsedFilters.status);
  }

  if (parsedFilters.themes && parsedFilters.themes.length > 0) {
    query = query.contains("themes", parsedFilters.themes);
  }

  if (parsedFilters.search) {
    query = query.or(
      `title.ilike.%${parsedFilters.search}%,description.ilike.%${parsedFilters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw mapSupabaseError(error, "Failed to fetch hackathons.");
  }

  return (data ?? []) as Hackathon[];
}

export async function getHackathonBySlug(
  slug: string,
  client?: SupabaseClient
) {
  const supabase = await resolveUserClient(client);
  const safeSlug = z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .parse(slug);

  const { data, error } = await supabase
    .from("hackathons")
    .select(HACKATHON_SELECT_COLUMNS)
    .eq("slug", safeSlug)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to load hackathon.");
  }

  if (!data) {
    throw new AppError("Hackathon not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Hackathon;
}

export async function getHackathonById(
  id: string,
  client?: SupabaseClient
) {
  const supabase = await resolveUserClient(client);
  const validatedId = z.string().uuid().parse(id);

  const { data, error } = await supabase
    .from("hackathons")
    .select(HACKATHON_SELECT_COLUMNS)
    .eq("id", validatedId)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to load hackathon.");
  }

  if (!data) {
    throw new AppError("Hackathon not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Hackathon;
}

export async function createHackathon(
  payload: CreateHackathonInput,
  client?: SupabaseClient
) {
  const parsed = createHackathonSchema.parse({
    ...payload,
    slug: normaliseSlug(payload.title, payload.slug)
  });

  const supabase = client ?? (createServiceRoleClient() as SupabaseClient);

  const body = {
    ...mapCreatePayload(parsed),
    slug: parsed.slug,
    created_by: parsed.created_by ?? null
  };

  const { data, error } = await supabase
    .from("hackathons")
    .insert(body)
    .select(HACKATHON_SELECT_COLUMNS)
    .single();

  if (error) {
    throw mapSupabaseError(error, "Failed to create hackathon.");
  }

  return ensureSupabaseData(
    { data, error: null },
    { notFoundMessage: "Hackathon creation failed." }
  ) as Hackathon;
}

export async function updateHackathon(
  payload: UpdateHackathonInput,
  client?: SupabaseClient
) {
  const parsed = updateHackathonSchema.parse(payload);
  const supabase = client ?? (createServiceRoleClient() as SupabaseClient);

  const updateBody = {
    ...mapUpdatePayload(parsed),
    slug: parsed.slug ? normaliseSlug(parsed.slug) : undefined,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("hackathons")
    .update(updateBody)
    .eq("id", parsed.id)
    .select(HACKATHON_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to update hackathon.");
  }

  if (!data) {
    throw new AppError("Hackathon not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Hackathon;
}

export async function deleteHackathon(
  id: string,
  client?: SupabaseClient
) {
  const validatedId = z.string().uuid().parse(id);
  const supabase = client ?? (createServiceRoleClient() as SupabaseClient);

  const { error } = await supabase
    .from("hackathons")
    .delete()
    .eq("id", validatedId);

  if (error) {
    throw mapSupabaseError(error, "Failed to delete hackathon.");
  }
}
