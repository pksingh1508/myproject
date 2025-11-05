import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

import { createServiceRoleClient } from "@/lib/supabase/service-role";

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

function getPrimaryEmail(event: WebhookEvent["data"]) {
  if (!("email_addresses" in event)) {
    return null;
  }

  const emailAddresses = event.email_addresses ?? [];
  const primaryEmailId = event.primary_email_address_id;

  const primaryEmail = emailAddresses.find(
    (email) => email.id === primaryEmailId
  );

  return (
    primaryEmail?.email_address ?? emailAddresses[0]?.email_address ?? null
  );
}

function getPrimaryPhone(event: WebhookEvent["data"]) {
  if (!("phone_numbers" in event)) {
    return null;
  }

  const phoneNumbers = event.phone_numbers ?? [];
  const primaryPhoneId = event.primary_phone_number_id;

  const primaryPhone = phoneNumbers.find(
    (phone) => phone.id === primaryPhoneId
  );

  return primaryPhone?.phone_number ?? phoneNumbers[0]?.phone_number ?? null;
}

export async function POST(request: Request) {
  console.log("🔔 Webhook received");

  if (!CLERK_WEBHOOK_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Missing Clerk webhook secret configuration" },
      { status: 500 }
    );
  }

  const headerList = await headers();
  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("❌ Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix signature headers" },
      { status: 400 }
    );
  }

  const payload = await request.text();
  let event: WebhookEvent;

  try {
    const wh = new Webhook(CLERK_WEBHOOK_SECRET);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature
    }) as WebhookEvent;
    console.log("✅ Webhook verified, event type:", event.type);
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature", details: `${error}` },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        console.log(`📝 Processing ${event.type} for user:`, event.data.id);

        const email = getPrimaryEmail(event.data);

        if (!email) {
          console.error("❌ No email found for user:", event.data.id);
          return NextResponse.json(
            { error: "Clerk user does not have an email address." },
            { status: 422 }
          );
        }

        const fullName = [
          "first_name" in event.data ? event.data.first_name : "",
          "last_name" in event.data ? event.data.last_name : ""
        ]
          .filter(Boolean)
          .join(" ")
          .trim();

        const rawMetadata =
          "public_metadata" in event.data ? event.data.public_metadata : {};
        const metadata = (rawMetadata ?? {}) as Record<string, unknown>;

        const getMetadataString = (key: string) => {
          const value = metadata[key];
          if (value === null || value === undefined) {
            return null;
          }
          return typeof value === "string" ? value : value.toString();
        };

        const profilePayload = {
          user_id: event.data.id,
          email,
          name: fullName || event.data.username || email,
          phone: getPrimaryPhone(event.data),
          college_name: getMetadataString("collegeName"),
          branch: getMetadataString("branch"),
          year_of_study: getMetadataString("yearOfStudy"),
          avatar_url:
            "image_url" in event.data ? event.data.image_url ?? null : null,
          role: getMetadataString("role") === "admin" ? "admin" : "user",
          is_verified:
            Boolean(metadata["isVerified"]) ||
            ("email_addresses" in event.data
              ? (event.data.email_addresses ?? []).some(
                  (emailAddress) =>
                    emailAddress.verification?.status === "verified"
                )
              : false)
        };

        console.log("📦 Upserting user data:", profilePayload);

        const { data, error: upsertError } = await supabase
          .from("users")
          .upsert(
            {
              ...profilePayload,
              updated_at: new Date().toISOString()
            },
            { onConflict: "email" }
          )
          .select();

        if (upsertError) {
          console.error("❌ Supabase upsert error:", upsertError);
          throw upsertError;
        }

        console.log("✅ User synced successfully:", data);
        break;
      }
      case "user.deleted": {
        console.log("🗑️ Deleting user:", event.data.id);

        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .eq("user_id", event.data.id);

        if (deleteError) {
          console.error("❌ Supabase delete error:", deleteError);
          throw deleteError;
        }

        console.log("✅ User deleted successfully");
        break;
      }
      default:
        console.log("⚠️ Unhandled event type:", event.type);
        break;
    }
  } catch (error) {
    console.error("❌ Webhook processing error:", error);

    const details =
      error instanceof Error ? error.message : JSON.stringify(error, null, 2);

    return NextResponse.json(
      { error: "Failed to sync Clerk user with Supabase", details },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
