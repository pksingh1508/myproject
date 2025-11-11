"use client";

import { useState } from "react";

import { toast } from "sonner";

import { BrandButton, CustomCard } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: ""
};

export default function ContactContent() {
  const [formValues, setFormValues] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
      });

      const text = await response.text();
      const payload = text ? (JSON.parse(text) as Record<string, unknown>) : null;

      if (!response.ok) {
        const message =
          typeof payload?.message === "string"
            ? payload.message
            : "Unable to send your message. Please try again.";
        throw new Error(message);
      }

      setFormValues(initialState);
      toast.success(
        (payload?.message as string) ??
          "Thanks for getting in touch. We’ll reach out soon."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again in a moment.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_60%)]" />
        <div className="relative mx-auto flex min-h-[50vh] w-full max-w-4xl flex-col justify-center gap-6 px-4 py-20 sm:px-6 lg:px-8">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
            Contact
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Talk to the HackathonWallah team
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Whether you&rsquo;re a student, mentor, or partner brand, we&rsquo;re here to help you ship your next idea.
            Reach out and we&rsquo;ll respond within 2-3 business days.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-16 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:px-6 lg:px-8">
        <CustomCard className="border border-border/60 bg-muted/30">
          <h2 className="text-xl font-semibold text-foreground">How can we help?</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Tell us about your question, collaboration idea, or support request. Provide as much detail as possible so we
            can connect you to the right organisers or mentors.
          </p>
          <div className="mt-6 space-y-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">Email</p>
              <p>hubhackathon15@gmail.com</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Phone</p>
              <p>+91-9865-4310</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Office</p>
              <p>Indranagar, Gorakhpur, 273001, India</p>
            </div>
          </div>
        </CustomCard>

        <CustomCard className="border border-border/60 bg-background p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formValues.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+91-XXXXXXXXXX"
                  value={formValues.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Tell us what this is about"
                  value={formValues.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Share your idea, question, or support request..."
                className="min-h-[160px]"
                value={formValues.message}
                onChange={handleChange}
                required
              />
            </div>

            <BrandButton type="submit" loading={submitting} loadingText="Sending..." className="px-8 py-3 text-xs">
              Submit message
            </BrandButton>
          </form>
        </CustomCard>
      </section>
    </main>
  );
}
