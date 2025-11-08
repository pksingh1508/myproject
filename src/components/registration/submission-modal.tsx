'use client'

import { useEffect, useState, type FormEvent } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hackathonId: string;
  hackathonTitle: string;
  initialUrl?: string | null;
  initialDescription?: string | null;
  onSubmitted?: (data: {
    submissionUrl: string;
    submissionDescription: string | null;
    submittedAt: string | null;
  }) => void;
}

export function SubmissionModal({
  open,
  onOpenChange,
  hackathonId,
  hackathonTitle,
  initialUrl,
  initialDescription,
  onSubmitted
}: SubmissionModalProps) {
  const [submissionUrl, setSubmissionUrl] = useState(initialUrl ?? "");
  const [submissionDescription, setSubmissionDescription] = useState(
    initialDescription ?? ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSubmissionUrl(initialUrl ?? "");
      setSubmissionDescription(initialDescription ?? "");
      setError(null);
      setSuccess(null);
    }
  }, [open, initialUrl, initialDescription]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/hackathons/${hackathonId}/submission`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionUrl,
          submissionDescription: submissionDescription?.trim() ? submissionDescription.trim() : undefined
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to save submission.");
      }

      onSubmitted?.({
        submissionUrl: payload?.data?.submissionUrl ?? submissionUrl,
        submissionDescription:
          payload?.data?.submissionDescription ?? submissionDescription ?? null,
        submittedAt: payload?.data?.submittedAt ?? null
      });

      setSuccess("Submission saved! You can update it anytime before the deadline.");
      onOpenChange(false);
    } catch (submissionError) {
      console.error("Submission failed", submissionError);
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save submission. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit your project for {hackathonTitle}</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {success ? (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="submission-url">Submission URL</Label>
            <Input
              id="submission-url"
              type="url"
              placeholder="https://github.com/your-team/project"
              value={submissionUrl}
              onChange={(event) => setSubmissionUrl(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submission-description">Description (optional)</Label>
            <Textarea
              id="submission-description"
              placeholder="Add a short summary, demo instructions, or credentials for reviewers."
              value={submissionDescription}
              onChange={(event) => setSubmissionDescription(event.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
