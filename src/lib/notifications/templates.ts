type NotificationTemplateKey =
  | "registration_pending_payment"
  | "payment_session_created"
  | "payment_success"
  | "payment_failed"
  | "payment_refunded";

interface TemplatePayload {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  emailSubject: string;
  emailBody: string;
}

type TemplateBuilder = (data: Record<string, unknown>) => TemplatePayload;

const templates: Record<NotificationTemplateKey, TemplateBuilder> = {
  registration_pending_payment: (data) => {
    const hackathon = (data.hackathonTitle as string) ?? "the hackathon";
    return {
      title: "Registration received",
      message: `You're successfully registered for ${hackathon}. Complete the payment to confirm your slot.`,
      type: "info",
      emailSubject: `Registration received for ${hackathon}`,
      emailBody: [
        `<p>Hi ${data.name ?? "there"},</p>`,
        `<p>We have recorded your registration for <strong>${hackathon}</strong>. Complete the ₹${data.amount ?? "99"} payment to secure your participation.</p>`,
        `<p>Use the link in the app to finish checkout. See you soon!</p>`
      ].join("")
    };
  },
  payment_session_created: (data) => {
    const hackathon = (data.hackathonTitle as string) ?? "the hackathon";
    return {
      title: "Complete your payment",
      message: `We generated a secure Cashfree checkout session for ${hackathon}. Open the payment widget to finish registration.`,
      type: "info",
      emailSubject: `Payment session ready for ${hackathon}`,
      emailBody: [
        `<p>Hi ${data.name ?? "there"},</p>`,
        `<p>Your payment session for <strong>${hackathon}</strong> is ready. Use the app to open the Cashfree checkout and complete the ₹${data.amount ?? "99"} fee.</p>`,
        `<p>If you run into issues, refresh the session or contact support.</p>`
      ].join("")
    };
  },
  payment_success: (data) => {
    const hackathon = (data.hackathonTitle as string) ?? "the hackathon";
    return {
      title: "Payment confirmed",
      message: `₹${data.amount ?? "99"} received for ${hackathon}. You're all set—watch your inbox for event updates.`,
      type: "success",
      emailSubject: `Payment confirmed for ${hackathon}`,
      emailBody: [
        `<p>Hi ${data.name ?? "there"},</p>`,
        `<p>Thanks! We received your payment for <strong>${hackathon}</strong>. Your participation is confirmed.</p>`,
        `<p>We'll share schedules and resources shortly. Stay tuned.</p>`
      ].join("")
    };
  },
  payment_failed: (data) => {
    const hackathon = (data.hackathonTitle as string) ?? "the hackathon";
    return {
      title: "Payment did not go through",
      message: `We couldn't process your payment for ${hackathon}. Please retry checkout or use a different method.`,
      type: "warning",
      emailSubject: `Payment attempt failed for ${hackathon}`,
      emailBody: [
        `<p>Hi ${data.name ?? "there"},</p>`,
        `<p>Your recent payment attempt for <strong>${hackathon}</strong> was unsuccessful. Please retry from the app to keep your registration active.</p>`,
        `<p>If you continue to face issues, reach out to support with the order reference <strong>${data.orderId ?? ""}</strong>.</p>`
      ].join("")
    };
  },
  payment_refunded: (data) => {
    const hackathon = (data.hackathonTitle as string) ?? "the hackathon";
    return {
      title: "Payment refunded",
      message: `Your payment for ${hackathon} has been refunded. Check your bank statement for confirmation.`,
      type: "info",
      emailSubject: `Refund processed for ${hackathon}`,
      emailBody: [
        `<p>Hi ${data.name ?? "there"},</p>`,
        `<p>We've processed a refund for your <strong>${hackathon}</strong> registration (amount ₹${data.amount ?? ""}).</p>`,
        `<p>The amount should reflect in your account shortly. Contact support if you have questions.</p>`
      ].join("")
    };
  }
};

export function buildNotificationTemplate(
  key: NotificationTemplateKey,
  data: Record<string, unknown>
) {
  return templates[key](data);
}

export type { NotificationTemplateKey };
