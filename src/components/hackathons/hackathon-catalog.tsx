"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, RotateCcw } from "lucide-react";
import { LayoutGroup, m } from "motion/react";

import type { Hackathon } from "@/types/database";
import { HackathonGrid } from "./hackathon-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_STATUS = "published,ongoing";

const STATUS_PRESETS = [
  { label: "Ongoing", value: DEFAULT_STATUS },
  { label: "Completed", value: "completed" },
] as const;

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
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <LayoutGroup id="catalog-filter">
          <div
            role="tablist"
            aria-label="Filter hackathons"
            className="inline-flex rounded-full border border-border bg-foreground/[0.03] p-1"
          >
            {STATUS_PRESETS.map((preset) => {
              const isActive = preset.value === activeStatus;
              const href = new URLSearchParams(paramsString);
              href.set("status", preset.value);

              return (
                <Link
                  key={preset.value}
                  role="tab"
                  aria-selected={isActive}
                  href={`/hackathons?${href.toString()}`}
                  scroll={false}
                  className={cn(
                    "relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
                    isActive ? "text-background" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive ? (
                    <m.span
                      layoutId="catalog-filter-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative">{preset.label}</span>
                </Link>
              );
            })}
          </div>
        </LayoutGroup>

        <p className="font-mono text-[0.78rem] text-muted-foreground" aria-live="polite">
          {isLoading ? (
            "fetching…"
          ) : error ? (
            "offline"
          ) : (
            <>
              <span className="text-foreground tabular-nums">
                {String(hackathons.length).padStart(2, "0")}
              </span>{" "}
              {hackathons.length === 1 ? "hackathon" : "hackathons"}
            </>
          )}
        </p>
      </div>

      {isLoading ? (
        <HackathonGridLoader />
      ) : error ? (
        <Alert variant="destructive" className="items-center py-5">
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
              <RotateCcw />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <HackathonGrid
          hackathons={hackathons}
          sortByCreatedAt
          emptyState={
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                No hackathons match these filters
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Try another filter, or check back soon for newly published events.
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
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Hackathon results are loading.</span>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <div className="h-44 skeleton rounded-none" />
            <div className="flex flex-col gap-3 p-6">
              <div className="flex gap-2">
                <div className="h-5 w-14 skeleton rounded-full" />
                <div className="h-5 w-20 skeleton rounded-full" />
              </div>
              <div className="h-7 w-4/5 skeleton" />
              <div className="h-4 w-full skeleton" />
              <div className="h-4 w-2/3 skeleton" />
              <div className="mt-4 h-4 w-1/2 skeleton" />
            </div>
            <div className="perforation mx-6 text-foreground/15" />
            <div className="flex items-center gap-6 p-6">
              <div className="h-9 w-28 skeleton" />
              <div className="h-9 w-16 skeleton" />
              <div className="ml-auto size-11 skeleton rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
