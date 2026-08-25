"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

import type { Hackathon } from "@/types/database";
import { HackathonGrid } from "./hackathon-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const DEFAULT_STATUS = "published,ongoing";

const STATUS_PRESETS = [
  { label: "Ongoing", value: DEFAULT_STATUS },
  { label: "Completed", value: "completed" },
] as const;

const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;

type HackathonsResponse = {
  data?: Hackathon[];
  message?: string;
};

export function HackathonCatalog() {
  const searchParams = useSearchParams();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  const paramsString = searchParams.toString();
  const activeStatus = searchParams.get("status") ?? DEFAULT_STATUS;
  const requestQuery = useMemo(() => {
    const params = new URLSearchParams(paramsString);
    if (!params.has("status")) {
      params.set("status", DEFAULT_STATUS);
    }
    return params.toString();
  }, [paramsString]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHackathons() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/hackathons?${requestQuery}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as HackathonsResponse;

        if (!response.ok) {
          throw new Error(payload.message ?? "Failed to load hackathons.");
        }

        setHackathons(Array.isArray(payload.data) ? payload.data : []);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }

        setHackathons([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load hackathons.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadHackathons();
    return () => controller.abort();
  }, [requestQuery, requestVersion]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_PRESETS.map((preset) => {
          const isActive = preset.value === activeStatus;
          const href = new URLSearchParams(paramsString);
          href.set("status", preset.value);

          return (
            <Button
              key={preset.value}
              asChild
              variant={isActive ? "default" : "outline"}
              size="sm"
            >
              <Link href={`/hackathons?${href.toString()}`} scroll={false}>
                {preset.label}
              </Link>
            </Button>
          );
        })}
      </div>

      {isLoading ? (
        <HackathonGridLoader />
      ) : error ? (
        <Alert className="items-center py-5">
          <AlertCircle className="size-4" />
          <AlertTitle>Could not load hackathons</AlertTitle>
          <AlertDescription className="gap-3">
            <p>{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRequestVersion((version) => version + 1)}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <HackathonGrid
          hackathons={hackathons}
          sortByCreatedAt
          emptyState={
            <div className="text-center" style={brandSansStyle}>
              <h3 className="text-lg font-semibold">
                No hackathons match filters
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting the filters or check back soon for newly published
                events.
              </p>
            </div>
          }
        />
      )}
    </div>
  );
}

export function HackathonGridLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-5"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Spinner className="size-4" />
        <span>Loading hackathons...</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            aria-hidden="true"
            className="min-h-[330px] overflow-hidden"
          >
            <CardHeader className="space-y-4">
              <div className="h-5 w-28 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
              <div className="h-7 w-4/5 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted motion-reduce:animate-none" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted motion-reduce:animate-none" />
              <div className="flex gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-muted motion-reduce:animate-none" />
              </div>
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted motion-reduce:animate-none" />
            </CardContent>
          </Card>
        ))}
      </div>
      <span className="sr-only">Hackathon results are loading.</span>
    </div>
  );
}
