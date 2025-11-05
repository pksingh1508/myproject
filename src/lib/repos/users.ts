import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { mapSupabaseError } from "@/lib/errors/app-error";

const selectColumns =
  "id,user_id,email,name,college_name,phone,year_of_study,branch,avatar_url";

export type UserRecord = {
  id: string;
  user_id: string;
  email: string;
  name: string;
  college_name: string | null;
  phone: string | null;
  year_of_study: string | null;
  branch: string | null;
  avatar_url: string | null;
};

async function getClient(client?: SupabaseClient) {
  if (client) return client;
  return createServiceRoleClient();
}

export async function getUserByInternalId(
  id: string,
  client?: SupabaseClient
) {
  const supabase = await getClient(client);
  const userId = z.string().uuid().parse(id);

  const { data, error } = await supabase
    .from("users")
    .select(selectColumns)
    .eq("id", userId)
    .maybeSingle<UserRecord>();

  if (error) {
    throw mapSupabaseError(error, "Failed to fetch user.");
  }

  return data ?? null;
}

export async function getUserByClerkId(
  clerkId: string,
  client?: SupabaseClient
) {
  const supabase = await getClient(client);
  const externalId = z.string().min(1).parse(clerkId);

  const { data, error } = await supabase
    .from("users")
    .select(selectColumns)
    .eq("user_id", externalId)
    .maybeSingle<UserRecord>();

  if (error) {
    throw mapSupabaseError(error, "Failed to fetch user.");
  }

  return data ?? null;
}
