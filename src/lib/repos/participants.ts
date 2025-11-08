import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import {
  participantRegistrationSchema,
  participantSubmissionSchema,
  paymentStatusSchema,
  type ParticipantPaymentStatusInput,
  type ParticipantRegistrationInput,
  type ParticipantSubmissionInput
} from "@/lib/validation/participants";
import {
  AppError,
  ensureSupabaseData,
  mapSupabaseError
} from "@/lib/errors/app-error";
import { createSupabaseServerClientFromAuth } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { Participant } from "@/types/database";

const PARTICIPANT_SELECT_COLUMNS =
  "id,user_id,hackathon_id,team_name,team_members,payment_status,payment_id,submission_url,submission_description,submitted_at,rank,prize_won,registered_at";

async function resolveClient(
  client?: SupabaseClient,
  { serviceRole = false }: { serviceRole?: boolean } = {}
) {
  if (client) return client;
  if (serviceRole) return createServiceRoleClient();
  return createSupabaseServerClientFromAuth();
}

export async function getParticipantById(
  participantId: string,
  client?: SupabaseClient
) {
  const supabase = await resolveClient(client);
  const id = z.string().uuid().parse(participantId);

  const { data, error } = await supabase
    .from("participants")
    .select(PARTICIPANT_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to load participant.");
  }

  if (!data) {
    throw new AppError("Participant not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Participant;
}

export async function getParticipantForUser(
  userId: string,
  hackathonId: string,
  client?: SupabaseClient
) {
  const supabase = await resolveClient(client);
  const parsed = {
    userId: z.string().uuid().parse(userId),
    hackathonId: z.string().uuid().parse(hackathonId)
  };

  const { data, error } = await supabase
    .from("participants")
    .select(PARTICIPANT_SELECT_COLUMNS)
    .eq("user_id", parsed.userId)
    .eq("hackathon_id", parsed.hackathonId)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to fetch participant.");
  }

  return data as Participant | null;
}

export async function registerParticipant(
  input: ParticipantRegistrationInput,
  client?: SupabaseClient
) {
  const supabase = await resolveClient(client);
  const payload = participantRegistrationSchema.parse(input);

  const existing = await getParticipantForUser(
    payload.userId,
    payload.hackathonId,
    supabase
  );

  if (existing) {
    throw new AppError("You have already registered for this hackathon.", {
      code: "CONFLICT",
      status: 409
    });
  }

  const teamMembers =
    payload.teamMembers && payload.teamMembers.length > 0
      ? payload.teamMembers
      : null;

  const { data, error } = await supabase
    .from("participants")
    .insert({
      user_id: payload.userId,
      hackathon_id: payload.hackathonId,
      team_name: payload.teamName ?? null,
      team_members: teamMembers,
      payment_status: "pending"
    })
    .select(PARTICIPANT_SELECT_COLUMNS)
    .single();

  if (error) {
    throw mapSupabaseError(error, "Failed to register participant.");
  }

  return ensureSupabaseData(
    { data, error: null },
    { notFoundMessage: "Participant registration failed." }
  ) as Participant;
}

export async function updateParticipantSubmission(
  input: ParticipantSubmissionInput,
  client?: SupabaseClient
) {
  const supabase = await resolveClient(client, { serviceRole: true });
  const payload = participantSubmissionSchema.parse(input);

  const { data, error } = await supabase
    .from("participants")
    .update({
      submission_url: payload.submissionUrl,
      submission_description: payload.submissionDescription ?? null,
      submitted_at: new Date().toISOString()
    })
    .eq("id", payload.participantId)
    .select(PARTICIPANT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to submit project details.");
  }

  if (!data) {
    throw new AppError("Participant not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Participant;
}

export async function updateParticipantPaymentStatus(
  input: ParticipantPaymentStatusInput,
  client?: SupabaseClient
) {
  const supabase = await resolveClient(client, { serviceRole: true });
  const payload = paymentStatusSchema.parse(input);

  const { data, error } = await supabase
    .from("participants")
    .update({
      payment_status: payload.paymentStatus,
      payment_id: payload.paymentId ?? null
    })
    .eq("id", payload.participantId)
    .select(PARTICIPANT_SELECT_COLUMNS)
    .maybeSingle();

  if (error) {
    throw mapSupabaseError(error, "Failed to update participant payment.");
  }

  if (!data) {
    throw new AppError("Participant not found.", {
      code: "NOT_FOUND",
      status: 404
    });
  }

  return data as Participant;
}
