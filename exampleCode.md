## 🔐 Phase 4: Authentication & User Management (Week 5)

### 4.1 Clerk Integration

#### Setup Clerk Middleware (`middleware.ts`)

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/about",
    "/contact",
    "/faq",
    "/hackathons",
    "/hackathons/(.*)",
    "/api/payments/webhook"
  ],
  ignoredRoutes: ["/api/webhook(.*)"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};
```

#### Clerk Webhook for User Sync (`api/auth/webhook/route.ts`)

```typescript
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Webhook verification failed", { status: 400 });
  }

  if (evt.type === "user.created") {
    await supabase.from("users").insert({
      clerk_id: evt.data.id,
      email: evt.data.email_addresses[0].email_address,
      name: `${evt.data.first_name} ${evt.data.last_name}`,
      avatar_url: evt.data.image_url
    });
  }

  if (evt.type === "user.updated") {
    await supabase
      .from("users")
      .update({
        email: evt.data.email_addresses[0].email_address,
        name: `${evt.data.first_name} ${evt.data.last_name}`,
        avatar_url: evt.data.image_url
      })
      .eq("clerk_id", evt.data.id);
  }

  return new Response("Webhook processed", { status: 200 });
}
```

### 4.2 User Onboarding Flow

- [ ] Create onboarding page (`app/(auth)/onboarding/page.tsx`)
- [ ] Collect additional info: college, year, branch
- [ ] Update user profile in Supabase
- [ ] Redirect to dashboard

### 4.3 Protected Routes

- [ ] Wrap dashboard with auth check
- [ ] Create loading states
- [ ] Handle unauthorized access

---

## 💰 Phase 5: Payment Integration (Week 6)

### 5.1 Cashfree SDK Setup (`lib/cashfree/client.ts`)

```typescript
import { Cashfree } from "cashfree-pg-sdk-javascript";

Cashfree.XClientId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID!;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY!;
Cashfree.XEnvironment =
  process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
    ? Cashfree.Environment.PRODUCTION
    : Cashfree.Environment.SANDBOX;

export { Cashfree };

export async function createPaymentOrder(data: {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  const request = {
    order_id: data.orderId,
    order_amount: data.amount,
    order_currency: "INR",
    customer_details: {
      customer_id: data.customerEmail,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone
    },
    order_meta: {
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify?order_id=${data.orderId}`
    }
  };

  return await Cashfree.PGCreateOrder("2023-08-01", request);
}
```

### 5.2 Payment API Routes

#### Create Payment Order (`api/payments/create-order/route.ts`)

```typescript
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { createPaymentOrder } from "@/lib/cashfree/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hackathonId, teamName, teamMembers } = await req.json();

    // Get user details
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    // Get hackathon details
    const { data: hackathon } = await supabase
      .from("hackathons")
      .select("*")
      .eq("id", hackathonId)
      .single();

    if (!hackathon || !user) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Check if already registered
    const { data: existing } = await supabase
      .from("participants")
      .select("*")
      .eq("user_id", user.id)
      .eq("hackathon_id", hackathonId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );
    }

    // Create participant entry
    const { data: participant } = await supabase
      .from("participants")
      .insert({
        user_id: user.id,
        hackathon_id: hackathonId,
        team_name: teamName,
        team_members: teamMembers,
        payment_status: "pending"
      })
      .select()
      .single();

    // Generate unique order ID
    const orderId = `ORDER_${Date.now()}_${user.id.slice(0, 8)}`;

    // Create payment entry
    await supabase.from("payments").insert({
      user_id: user.id,
      hackathon_id: hackathonId,
      participant_id: participant.id,
      order_id: orderId,
      amount: hackathon.participation_fee,
      status: "initiated"
    });

    // Create Cashfree order
    const paymentOrder = await createPaymentOrder({
      orderId,
      amount: hackathon.participation_fee,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone || "9999999999"
    });

    return NextResponse.json({
      orderId,
      paymentSessionId: paymentOrder.payment_session_id
    });
  } catch (error) {
    console.error("Payment order creation failed:", error);
    return NextResponse.json(
      { error: "Payment initiation failed" },
      { status: 500 }
    );
  }
}
```

#### Verify Payment (`api/payments/verify/route.ts`)

```typescript
import { NextResponse } from "next/server";
import { Cashfree } from "@/lib/cashfree/client";
import { supabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("order_id");

  if (!orderId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`
    );
  }

  try {
    // Verify payment with Cashfree
    const orderStatus = await Cashfree.PGOrderFetchPayments(
      "2023-08-01",
      orderId
    );

    const paymentStatus = orderStatus[0]?.payment_status;

    // Update payment status in database
    const { data: payment } = await supabase
      .from("payments")
      .update({
        status: paymentStatus === "SUCCESS" ? "success" : "failed",
        payment_id: orderStatus[0]?.cf_payment_id,
        payment_method: orderStatus[0]?.payment_method,
        gateway_response: orderStatus[0]
      })
      .eq("order_id", orderId)
      .select()
      .single();

    if (paymentStatus === "SUCCESS") {
      // Update participant status
      await supabase
        .from("participants")
        .update({
          payment_status: "paid",
          payment_id: orderStatus[0]?.cf_payment_id
        })
        .eq("id", payment.participant_id);

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`
      );
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=failed`
    );
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=error`
    );
  }
}
```

#### Payment Webhook (`api/payments/webhook/route.ts`)

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const signature = req.headers.get("x-webhook-signature");

    // Verify webhook signature
    const computedSignature = crypto
      .createHmac("sha256", process.env.CASHFREE_SECRET_KEY!)
      .update(JSON.stringify(payload))
      .digest("base64");

    if (signature !== computedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { order_id, payment_status, cf_payment_id } = payload.data;

    // Update payment status
    const { data: payment } = await supabase
      .from("payments")
      .update({
        status: payment_status === "SUCCESS" ? "success" : "failed",
        payment_id: cf_payment_id,
        gateway_response: payload.data
      })
      .eq("order_id", order_id)
      .select()
      .single();

    if (payment_status === "SUCCESS") {
      await supabase
        .from("participants")
        .update({
          payment_status: "paid",
          payment_id: cf_payment_id
        })
        .eq("id", payment.participant_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
```

### 5.3 Payment Button Component

```typescript
// components/payments/PaymentButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { load } from "@cashfreepayments/cashfree-js";

interface PaymentButtonProps {
  hackathonId: string;
  amount: number;
  hackathonTitle: string;
}

export function PaymentButton({
  hackathonId,
  amount,
  hackathonTitle
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create payment order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackathonId })
      });

      const { orderId, paymentSessionId } = await response.json();

      // Initialize Cashfree
      const cashfree = await load({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_ENV === "production"
            ? "production"
            : "sandbox"
      });

      // Open payment modal
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self"
      });
    } catch (error) {
      console.error("Payment failed:", error);
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} size="lg">
      {loading ? "Processing..." : `Pay ₹${amount} & Register`}
    </Button>
  );
}
```

---

## 🎛️ Phase 6: Admin Dashboard (Week 7)

### 6.1 Admin Middleware

```typescript
// lib/auth/admin.ts
import { auth } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/server";

export async function checkAdmin() {
  const { userId } = auth();

  if (!userId) {
    return { isAdmin: false, user: null };
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", userId)
    .single();

  return {
    isAdmin: user?.role === "admin",
    user
  };
}
```

### 6.2 Admin Layout with Navigation

```typescript
// app/(admin)/admin/layout.tsx
import { redirect } from "next/navigation";
import { checkAdmin } from "@/lib/auth/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await checkAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

### 6.3 Create Hackathon Form

```typescript
// app/(admin)/admin/hackathons/create/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

const hackathonSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  location_type: z.enum(["online", "offline", "hybrid"]),
  start_date: z.string(),
  end_date: z.string(),
  registration_start: z.string(),
  registration_end: z.string(),
  prize_pool: z.number().min(1000),
  participation_fee: z.number().min(0),
  max_participants: z.number().optional()
  // ... more fields
});

export default function CreateHackathonPage() {
  const form = useForm<z.infer<typeof hackathonSchema>>({
    resolver: zodResolver(hackathonSchema)
  });

  const onSubmit = async (values: z.infer<typeof hackathonSchema>) => {
    const response = await fetch("/api/admin/hackathons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      // Success handling
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Hackathon</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Form fields implementation */}
          <Button type="submit">Create Hackathon</Button>
        </form>
      </Form>
    </div>
  );
}
```

### 6.4 Admin API Routes

#### Create Hackathon (`api/admin/hackathons/route.ts`)

```typescript
import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/auth/admin";
import { supabase } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

export async function POST(req: Request) {
  const { isAdmin, user } = await checkAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const slug = generateSlug(data.title);

    const { data: hackathon, error } = await supabase
      .from("hackathons")
      .insert({
        ...data,
        slug,
        created_by: user.id,
        status: "draft"
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ hackathon });
  } catch (error) {
    console.error("Failed to create hackathon:", error);
    return NextResponse.json(
      { error: "Failed to create hackathon" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { isAdmin } = await checkAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data: hackathons } = await supabase
    .from("hackathons")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({ hackathons });
}
```

### 6.5 Participant Management

- [ ] View all participants for a hackathon
- [ ] Export participants to CSV
- [ ] Update participant status
- [ ] Declare winners and assign prizes

### 6.6 Analytics Dashboard

- [ ] Total revenue
- [ ] Participants count
- [ ] Registration trends chart
- [ ] Payment success rate
- [ ] Popular hackathons

---

## 📧 Phase 7: Email & Notifications (Week 8)

### 7.1 Setup Resend Email

```typescript
// lib/email/client.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

### 7.2 Email Templates

```typescript
// lib/email/templates/registration-success.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text
} from "@react-email/components";

interface RegistrationSuccessEmailProps {
  userName: string;
  hackathonTitle: string;
  hackathonDate: string;
  hackathonLocation: string;
}

export function RegistrationSuccessEmail({
  userName,
  hackathonTitle,
  hackathonDate,
  hackathonLocation
}: RegistrationSuccessEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You're registered for {hackathonTitle}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Registration Successful! 🎉</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            You've successfully registered for <strong>{hackathonTitle}</strong>.
          </Text>
          <Text style={text}>
            <strong>Date:</strong> {hackathonDate}
            <br />
            <strong>Location:</strong> {hackathonLocation}
          </Text>
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
            style={button}
          >
            View Dashboard
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f6f9fc", fontFamily: "sans-serif" };
const container = { margin: "0 auto", padding: "20px" };
const h1 = { color: "#333", fontSize: "24px" };
const text = { color: "#333", fontSize: "16px", lineHeight: "24px" };
const button = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "12px 24px",
  textDecoration: "none",
  borderRadius: "5px",
  display: "inline-block",
  marginTop: "16px"
};
```

### 7.3 Send Email Function

```typescript
// lib/email/send.ts
import { resend } from "./client";
import { RegistrationSuccessEmail } from "./templates/registration-success";

export async function sendRegistrationEmail(data: {
  to: string;
  userName: string;
  hackathonTitle: string;
  hackathonDate: string;
  hackathonLocation: string;
}) {
  await resend.emails.send({
    from: "HackathonWallah <noreply@hackathonwallah.com>",
    to: data.to,
    subject: `You're registered for ${data.hackathonTitle}`,
    react: RegistrationSuccessEmail({
      userName: data.userName,
      hackathonTitle: data.hackathonTitle,
      hackathonDate: data.hackathonDate,
      hackathonLocation: data.hackathonLocation
    })
  });
}
```

### 7.4 In-App Notifications

```typescript
// hooks/useNotifications.ts
import useSWR from "swr";

export function useNotifications() {
  const { data, error, mutate } = useSWR("/api/notifications");

  const markAsRead = async (notificationId: string) => {
    await fetch(`/api/notifications/${notificationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: true })
    });
    mutate();
  };

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading: !error && !data,
    markAsRead
  };
}
```

---

## 🧪 Phase 8: Testing & Quality Assurance (Week 9)

### 8.1 Unit Testing Setup

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

#### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*): '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

### 8.2 Component Tests

```typescript
// __tests__/components/HackathonCard.test.tsx
import { render, screen } from "@testing-library/react";
import { HackathonCard } from "@/components/hackathons/HackathonCard";

describe("HackathonCard", () => {
  it("renders hackathon details correctly", () => {
    const mockHackathon = {
      id: "1",
      title: "Test Hackathon",
      prize_pool: 10000
      // ... more fields
    };

    render(<HackathonCard hackathon={mockHackathon} />);

    expect(screen.getByText("Test Hackathon")).toBeInTheDocument();
    expect(screen.getByText("₹10,000")).toBeInTheDocument();
  });
});
```

### 8.3 API Route Tests

```typescript
// __tests__/api/payments/create-order.test.ts
import { POST } from "@/app/api/payments/create-order/route";
import { mockAuth } from "@/test/utils";

describe("POST /api/payments/create-order", () => {
  it("creates payment order successfully", async () => {
    mockAuth({ userId: "test-user-id" });

    const request = new Request(
      "http://localhost:3000/api/payments/create-order",
      {
        method: "POST",
        body: JSON.stringify({ hackathonId: "test-hackathon-id" })
      }
    );

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("orderId");
    expect(data).toHaveProperty("paymentSessionId");
  });
});
```

### 8.4 E2E Testing with Playwright

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/registration-flow.spec.ts
import { test, expect } from "@playwright/test";

test("complete registration flow", async ({ page }) => {
  // Navigate to hackathon
  await page.goto("/hackathons/test-hackathon");

  // Click register button
  await page.click("text=Register Now");

  // Fill payment details (in sandbox mode)
  // ... payment flow

  // Verify success
  await expect(page).toHaveURL("/dashboard?payment=success");
  await expect(page.locator("text=Registration Successful")).toBeVisible();
});
```

### 8.5 Testing Checklist

- [ ] Unit tests for utility functions
- [ ] Component tests for all major components
- [ ] Integration tests for API routes
- [ ] E2E tests for critical user flows
- [ ] Payment flow testing (sandbox)
- [ ] Email sending verification
- [ ] Mobile responsiveness testing
- [ ] Browser compatibility testing
- [ ] Accessibility testing (WCAG 2.1)
- [ ] Performance testing (Lighthouse)

---

## 🚀 Phase 9: Deployment & DevOps (Week 10)

### 9.1 Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] RLS policies tested
- [ ] Payment gateway in production mode
- [ ] Email domain verified
- [ ] Analytics tracking verified
- [ ] Error monitoring setup
- [ ] SSL certificates configured

### 9.2 Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Vercel Configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "env": {
    "NEXT_PUBLIC_APP_URL": "https://hackathonwallah.com"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 9.3 Supabase Production Setup

- [ ] Create production project
- [ ] Run migrations
- [ ] Configure RLS policies
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Set up monitoring alerts

### 9.4 Domain Configuration

- [ ] Purchase domain
- [ ] Configure DNS records
- [ ] Set up www redirect
- [ ] Configure email domain (for Resend)
- [ ] Set up SSL/TLS

### 9.5 Monitoring & Error Tracking

```bash
npm install @sentry/nextjs
```

#### Sentry Configuration

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV
});
```

### 9.6 Performance Optimization

- [ ] Enable Next.js Image Optimization
- [ ] Implement lazy loading
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] Database query optimization
- [ ] Implement caching (Redis/Vercel KV)
- [ ] CDN for static assets

### 9.7 SEO Optimization

```typescript
// app/layout.tsx
export const metadata = {
  title: "HackathonWallah - Join College Hackathons & Win Prizes",
  description:
    "Participate in online and offline hackathons, win cash prizes, and grow your skills.",
  keywords: "hackathon, college hackathon, coding competition, win prizes",
  openGraph: {
    title: "HackathonWallah",
    description: "Join hackathons and win prizes",
    images: ["/og-image.jpg"]
  }
};
```

### 9.8 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

---

## 📊 Phase 10: Analytics & Growth (Week 11+)

### 10.1 PostHog Integration

```typescript
// lib/posthog/client.ts
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    }
  });
}

export { posthog };
```

### 10.2 Event Tracking

```typescript
// Track key events
posthog.capture("hackathon_viewed", {
  hackathon_id: hackathonId,
  hackathon_title: title
});

posthog.capture("registration_started", {
  hackathon_id: hackathonId
});

posthog.capture("payment_completed", {
  hackathon_id: hackathonId,
  amount: amount
});
```
