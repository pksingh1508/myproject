import { createNotification } from "@/lib/repos/notifications";
import { getUserByInternalId } from "@/lib/repos/users";
import { buildNotificationTemplate, type NotificationTemplateKey } from "@/lib/notifications/templates";

interface DispatchNotificationParams {
  userId: string;
  template: NotificationTemplateKey;
  data?: Record<string, unknown>;
}

async function sendEmail(
  to: string | null | undefined,
  subject: string,
  html: string
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "notifications@hackathonhub.test";

  if (!apiKey || !to) {
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html
      })
    });
  } catch (error) {
    console.error("Failed to send Resend email:", error);
  }
}

export async function dispatchNotification({
  userId,
  template,
  data = {}
}: DispatchNotificationParams) {
  const user = await getUserByInternalId(userId);

  if (!user) {
    console.warn("Notification skipped: user not found", userId);
    return;
  }

  const mergedData = {
    name: user.name,
    email: user.email,
    ...data
  };

  const templatePayload = buildNotificationTemplate(template, mergedData);

  const actionUrlRaw = data["actionUrl"];
  const actionUrl =
    typeof actionUrlRaw === "string" && actionUrlRaw.length > 0
      ? actionUrlRaw
      : undefined;

  await createNotification({
    userId: user.id,
    title: templatePayload.title,
    message: templatePayload.message,
    type: templatePayload.type,
    actionUrl
  });

  await sendEmail(user.email, templatePayload.emailSubject, templatePayload.emailBody);
}



