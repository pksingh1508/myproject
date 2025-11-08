'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Hackathon } from "@/types/database";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import type { VariantProps } from "class-variance-authority";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "@/components/registration/profile-form";
import { TeamForm, type TeamFormOutput } from "@/components/registration/team-form";
import { SubmissionModal } from "@/components/registration/submission-modal";
import { loadCashfreeDropSdk } from "@/lib/payments/cashfree-drop";
import type { UserProfileRecord } from "@/lib/auth/require-user-profile";
import type { UserProfileUpdateInput } from "@/lib/validation/users";

interface RegistrationDialogProps {
  hackathon: Hackathon;
  buttonLabel?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
  buttonSize?: VariantProps<typeof buttonVariants>["size"];
  buttonClassName?: string;
}

type ProfileState =
  | {
      profile: UserProfileRecord;
      complete: boolean;
      missingFields: string[];
    }
  | null;

type ParticipantStatus = {
  id: string;
  paymentStatus: string;
  paymentId?: string | null;
  submissionUrl?: string | null;
  submissionDescription?: string | null;
  submittedAt?: string | null;
};

type RegistrationStatus =
  | {
      registered: boolean;
      participant?: ParticipantStatus;
    }
  | null;

type PaymentDetails = {
  orderId: string;
  paymentSessionId: string;
  amount: number;
};

async function fetchProfile(): Promise<ProfileState> {
  const response = await fetch("/api/profile", {
    method: "GET",
    credentials: "include",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to load profile.");
  }

  return response.json();
}

async function fetchRegistrationStatus(
  hackathonId: string
): Promise<RegistrationStatus> {
  const response = await fetch(
    `/api/hackathons/${hackathonId}/registration-status`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store"
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      return { registered: false };
    }
    throw new Error("Failed to load registration status.");
  }

  return response.json();
}

export function HackathonRegistrationDialog({
  hackathon,
  buttonLabel = "Register now",
  buttonVariant = "default",
  buttonSize = "lg",
  buttonClassName
}: RegistrationDialogProps) {
  const router = useRouter();
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [profileState, setProfileState] = useState<ProfileState>(null);
  const [status, setStatus] = useState<RegistrationStatus>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [teamSubmitting, setTeamSubmitting] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [launchingCheckout, setLaunchingCheckout] = useState(false);

  const needsProfile = profileState ? !profileState.complete : false;
  const alreadyRegistered = status?.registered ?? false;
  const participantId = currentParticipantId ?? status?.participant?.id ?? null;
  const paymentSettled =
    status?.participant?.paymentStatus?.toLowerCase() === "paid";
  const hasSubmitted = Boolean(status?.participant?.submissionUrl);

  const initiatePayment = useCallback(
    async (targetParticipantId: string) => {
      setCurrentParticipantId(targetParticipantId);
      setIsCreatingOrder(true);
      setError(null);
      try {
        const response = await fetch("/api/payments/create-order", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participantId: targetParticipantId })
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(
            payload?.message ?? "Failed to create Cashfree order."
          );
        }

        const result = await response.json();
        setPaymentDetails(result.data);
        setSuccess(
          "Payment session generated. Use the checkout button below to open Cashfree and finish payment."
        );
        setStatus((previous) => ({
          registered: true,
          participant: {
            ...(previous?.participant ?? {}),
            id: targetParticipantId,
            paymentStatus: "pending",
            paymentId: previous?.participant?.paymentId,
            submissionUrl: previous?.participant?.submissionUrl,
            submissionDescription: previous?.participant?.submissionDescription,
            submittedAt: previous?.participant?.submittedAt
          }
        }));
        router.refresh();
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Unable to create payment order."
        );
      } finally {
        setIsCreatingOrder(false);
      }
    },
    [router]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPaymentDetails(null);
    try {
      const [profile, registration] = await Promise.all([
        fetchProfile(),
        fetchRegistrationStatus(hackathon.id)
      ]);
      setProfileState(profile);
      setStatus(registration);
      setCurrentParticipantId(registration?.participant?.id ?? null);
    } catch (err) {
      console.error(err);
      setError("Unable to load registration data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hackathon.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (registrationDialogOpen) {
      loadData();
    } else {
      setError(null);
      setSuccess(null);
      setPaymentDetails(null);
    }
  }, [registrationDialogOpen, loadData]);

  useEffect(() => {
    if (
      registrationDialogOpen &&
      !loading &&
      alreadyRegistered &&
      !paymentSettled &&
      participantId &&
      !paymentDetails &&
      !isCreatingOrder
    ) {
      initiatePayment(participantId);
    }
  }, [
    registrationDialogOpen,
    loading,
    alreadyRegistered,
    paymentSettled,
    participantId,
    paymentDetails,
    isCreatingOrder,
    initiatePayment
  ]);

  const handleProfileSubmit = useCallback(
    async (values: UserProfileUpdateInput) => {
      setProfileSubmitting(true);
      setError(null);
      try {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Failed to update profile.");
        }

        const updated = await response.json();
        setProfileState(updated);
        setSuccess("Profile updated. You're ready to register.");
        router.refresh();
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to update profile."
        );
      } finally {
        setProfileSubmitting(false);
      }
    },
    [router]
  );

  const handleTeamSubmit = useCallback(
    async (values: TeamFormOutput) => {
      setTeamSubmitting(true);
      setError(null);
      setSuccess(null);
      try {
        const response = await fetch(
          `/api/hackathons/${hackathon.id}/register`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values)
          }
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Failed to register.");
        }

        const result = await response.json();
        const newParticipantId: string = result.data.id;

        setStatus((previous) => ({
          registered: true,
          participant: {
            ...(previous?.participant ?? {}),
            id: newParticipantId,
            paymentStatus: result.data.paymentStatus,
            paymentId: previous?.participant?.paymentId,
            submissionUrl: previous?.participant?.submissionUrl,
            submissionDescription: previous?.participant?.submissionDescription,
            submittedAt: previous?.participant?.submittedAt
          }
        }));

        setSuccess(
          "Registration successful! Generating a payment session..."
        );

        await initiatePayment(newParticipantId);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to register."
        );
      } finally {
        setTeamSubmitting(false);
      }
    },
    [hackathon.id, initiatePayment]
  );

  const handlePaymentVerification = useCallback(async () => {
    if (!paymentDetails) {
      setError("Payment details unavailable. Generate a payment session first.");
      return;
    }

    setVerifyingPayment(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: paymentDetails.orderId })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to verify payment status.");
      }

      const paymentStatus: string =
        payload?.data?.paymentStatus ?? payload?.data?.orderStatus ?? "pending";
      const paymentId: string | undefined =
        payload?.data?.paymentId ?? paymentDetails.orderId;

      if (paymentStatus === "success") {
        const participantRef = participantId;

        if (participantRef) {
          setStatus((previous) => ({
            registered: true,
            participant: {
              ...(previous?.participant ?? {}),
              id: participantRef,
              paymentStatus: "paid",
              paymentId: paymentId ?? previous?.participant?.paymentId,
              submissionUrl: previous?.participant?.submissionUrl,
              submissionDescription: previous?.participant?.submissionDescription,
              submittedAt: previous?.participant?.submittedAt
            }
          }));
          setCurrentParticipantId(participantRef);
        }

        setSuccess("Payment confirmed! Your registration is complete.");
        setPaymentDetails(null);
        router.refresh();
      } else if (paymentStatus === "failed") {
        setError("Payment failed or was cancelled. Please try again.");
        if (participantId) {
          setStatus((previous) => ({
            registered: true,
            participant: {
              ...(previous?.participant ?? {}),
              id: participantId,
              paymentStatus: "failed",
              paymentId: previous?.participant?.paymentId,
              submissionUrl: previous?.participant?.submissionUrl,
              submissionDescription: previous?.participant?.submissionDescription,
              submittedAt: previous?.participant?.submittedAt
            }
          }));
        }
      } else {
        setSuccess(
          "Payment is still pending confirmation. Please retry verification after a few moments."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to verify payment."
      );
    } finally {
      setVerifyingPayment(false);
    }
  }, [paymentDetails, participantId, router]);

  const handleSubmissionSuccess = useCallback(
    (data: {
      submissionUrl: string;
      submissionDescription: string | null;
      submittedAt: string | null;
    }) => {
      setStatus((previous) => {
        const participantRef = previous?.participant ?? null;
        const derivedId = participantRef?.id ?? participantId;

        if (!derivedId) {
          return previous;
        }

        return {
          registered: true,
          participant: {
            ...(participantRef ?? {}),
            id: derivedId,
            paymentStatus: participantRef?.paymentStatus ?? "paid",
            paymentId: participantRef?.paymentId,
            submissionUrl: data.submissionUrl,
            submissionDescription: data.submissionDescription,
            submittedAt: data.submittedAt
          }
        };
      });

      setSubmissionModalOpen(false);
      setSuccess("Submission received! We'll review it soon.");
      router.refresh();
    },
    [participantId, router]
  );

  const profileDefaultValues = useMemo(() => {
    if (!profileState?.profile) {
      return {};
    }

    return {
      name: profileState.profile.name ?? "",
      college_name: profileState.profile.college_name ?? "",
      branch: profileState.profile.branch ?? "",
      phone: profileState.profile.phone ?? "",
      year_of_study: profileState.profile.year_of_study ?? ""
    };
  }, [profileState]);

  const primaryButtonLabel = alreadyRegistered
    ? paymentSettled
      ? hasSubmitted
        ? "Submitted"
        : "Submit code"
      : "Complete payment"
    : buttonLabel;

  const isPrimaryButtonDisabled =
    alreadyRegistered && paymentSettled && hasSubmitted;

  const handlePrimaryButtonClick = useCallback(() => {
    if (alreadyRegistered && paymentSettled) {
      if (!hasSubmitted) {
        setSubmissionModalOpen(true);
      }
      return;
    }

    setRegistrationDialogOpen(true);
  }, [alreadyRegistered, paymentSettled, hasSubmitted]);

  const handleCheckoutLaunch = useCallback(async () => {
    if (!paymentDetails) {
      setError("Payment details unavailable. Generate a payment session first.");
      return;
    }

    setLaunchingCheckout(true);
    setError(null);

    try {
      const CashfreeCtor = await loadCashfreeDropSdk();

      if (!CashfreeCtor) {
        throw new Error("Unable to load Cashfree checkout. Please check your connection.");
      }

      const cashfree = new CashfreeCtor(paymentDetails.paymentSessionId);
      cashfree.redirect();
    } catch (checkoutError) {
      console.error("Cashfree checkout launch failed:", checkoutError);
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to open Cashfree checkout. Please try again."
      );
    } finally {
      setLaunchingCheckout(false);
    }
  }, [paymentDetails]);

  const handleCancelPayment = useCallback(() => {
    setRegistrationDialogOpen(false);
  }, []);

  return (
    <>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className={buttonClassName}
        onClick={handlePrimaryButtonClick}
        disabled={isPrimaryButtonDisabled}
      >
        {primaryButtonLabel}
      </Button>

      <Dialog
        open={registrationDialogOpen}
        onOpenChange={setRegistrationDialogOpen}
      >

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register for {hackathon.title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">
            Loading registration details...
          </p>
        ) : (
          <div className="space-y-6 py-2">
            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Something went wrong</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            {success ? (
              <Alert>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            ) : null}

            {alreadyRegistered ? (
              <div className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    You are already registered for this hackathon. Current
                    payment status:{" "}
                    <span className="font-medium text-foreground">
                      {status?.participant?.paymentStatus ?? "pending"}
                    </span>
                    .
                  </p>
                  {paymentSettled ? (
                    <p>Your payment is confirmed. See you at the hackathon!</p>
                  ) : (
                    <p>
                      Use the secure Cashfree checkout below to finish the INR{" "}
                      {hackathon.participation_fee?.toFixed(0)} registration fee.
                    </p>
                  )}
                </div>

                {!paymentSettled ? (
                  <>
                    {paymentDetails ? (
                      <div className="space-y-4 rounded-md border bg-muted/30 p-4">
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>
                            Complete the INR {paymentDetails.amount.toFixed(0)} payment on the secure
                            Cashfree page. Use the buttons below to launch checkout, verify status, or cancel.
                          </p>
                          <p>
                            Order reference: <span className="font-medium text-foreground">{paymentDetails.orderId}</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            onClick={handleCheckoutLaunch}
                            disabled={launchingCheckout}
                          >
                            {launchingCheckout ? "Opening checkout..." : "Checkout"}
                          </Button>
                          <Button
                            type="button"
                            onClick={handlePaymentVerification}
                            disabled={verifyingPayment}
                          >
                            {verifyingPayment ? "Verifying..." : "Verify payment status"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelPayment}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="default"
                        className="w-full"
                        disabled={isCreatingOrder || !participantId}
                        onClick={() =>
                          participantId && initiatePayment(participantId)
                        }
                      >
                        {isCreatingOrder
                          ? "Generating payment session..."
                          : "Generate payment session"}
                      </Button>
                    )}
                  </>
                ) : null}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setRegistrationDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <>
                {needsProfile ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">
                        Complete your profile
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Tell organisers a little more about you. This
                        information is required before you can secure your slot.
                      </p>
                    </div>
                    <ProfileForm
                      defaultValues={profileDefaultValues}
                      submitting={profileSubmitting}
                      onSubmit={handleProfileSubmit}
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Team details</h3>
                      <p className="text-sm text-muted-foreground">
                        Provide your team information. You can invite teammates
                        later, but make sure you meet the minimum team size of{" "}
                        {hackathon.min_team_size}.
                      </p>
                    </div>
                    <TeamForm
                      minSize={hackathon.min_team_size}
                      maxSize={hackathon.max_team_size}
                      submitting={teamSubmitting}
                      onSubmit={handleTeamSubmit}
                    />
                    <Separator />
                    <p className="text-xs text-muted-foreground">
                      By registering you agree to abide by the hackathon rules
                      and {hackathon.participation_fee
                        ? `will be redirected to pay INR ${hackathon.participation_fee.toFixed(
                            0
                          )} via Cashfree in the next step.`
                        : "confirm your attendance without any participation fee."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>

      <SubmissionModal
        open={submissionModalOpen}
        onOpenChange={setSubmissionModalOpen}
        hackathonId={hackathon.id}
        hackathonTitle={hackathon.title}
        initialUrl={status?.participant?.submissionUrl}
        initialDescription={status?.participant?.submissionDescription}
        onSubmitted={handleSubmissionSuccess}
      />
    </>
  );
}

export function HackathonRegistrationButton({
  hackathon,
  buttonLabel,
  buttonVariant,
  buttonSize,
  buttonClassName
}: RegistrationDialogProps) {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant={buttonVariant}
            size={buttonSize}
            className={buttonClassName}
          >
            Sign in to register
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <HackathonRegistrationDialog
          hackathon={hackathon}
          buttonLabel={buttonLabel}
          buttonVariant={buttonVariant}
          buttonSize={buttonSize}
          buttonClassName={buttonClassName}
        />
      </SignedIn>
    </>
  );
}
