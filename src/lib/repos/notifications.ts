import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { mapSupabaseError } from "@/lib/errors/app-error";

const insertSchema = z.object({
  userId: z.string().uuid(),
  title: z.string().min(1),
  message: z.string().min(1),
  type: z.enum(["info", "success", "warning", "error"]).default("info"),
  actionUrl: z.string().url().optional()
});

export type CreateNotificationInput = z.infer<typeof insertSchema>;

export async function createNotification(
  input: CreateNotificationInput,
  client?: SupabaseClient
) {
  const payload = insertSchema.parse(input);
  const supabase = client ?? createServiceRoleClient();

  const { error } = await supabase.from("notifications").insert({
    user_id: payload.userId,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    action_url: payload.actionUrl ?? null
  });

  if (error) {
    throw mapSupabaseError(error, "Failed to create notification.");
  }
}

export type ListNotificationsInput = {
  userId: string;
  limit?: number;
};

export async function listNotificationsForUser(
  input: ListNotificationsInput,
  client?: SupabaseClient
) {
  const userId = z.string().uuid().parse(input.userId);
  const limit = z.number().int().min(1).max(100).parse(input.limit ?? 20);

  const supabase = client ?? createServiceRoleClient();

  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id,user_id,title,message,type,is_read,action_url,created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw mapSupabaseError(error, "Failed to fetch notifications.");
  }

  return data ?? [];
}

export async function markNotificationRead(
  notificationId: string,
  userId: string,
  client?: SupabaseClient
) {
  const supabase = client ?? createServiceRoleClient();
  const id = z.string().uuid().parse(notificationId);
  const ownerId = z.string().uuid().parse(userId);

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", ownerId);

  if (error) {
    throw mapSupabaseError(error, "Failed to update notification.");
  }
}

